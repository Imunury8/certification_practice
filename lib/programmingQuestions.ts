import type { Difficulty, ProgrammingLanguage, QuestionTemplate } from "./types";

export interface ProgrammingExercise {
  id: string;
  language: ProgrammingLanguage;
  concept: string;
  difficulty: Difficulty;
  source: string;
  answer: string;
  explanation: string;
}

const exercises: ProgrammingExercise[] = [];

function add(
  id: string, language: ProgrammingLanguage, concept: string, difficulty: Difficulty,
  source: string, answer: string, explanation: string,
) {
  exercises.push({ id, language, concept, difficulty, source: source.trim(), answer, explanation });
}

function indent(source: string, spaces = 4) {
  return source.trim().split("\n").map((line) => `${" ".repeat(spaces)}${line}`).join("\n");
}

function c(body: string, declarations = "") {
  return `#include <stdio.h>\n#include <string.h>\n${declarations.trim()}\nint main(void) {\n${indent(body)}\n    return 0;\n}`;
}

function java(body: string, members = "", supportingClasses = "") {
  return `import java.util.*;\n${supportingClasses.trim()}\npublic class Main {\n${members.trim() ? `${indent(members)}\n` : ""}    public static void main(String[] args) {\n${indent(body, 8)}\n    }\n}`;
}

// Original output-tracing exercises. Each source is complete and executable.
// C uses defined C99 behavior; Java uses Java 8 syntax; Python uses Python 3.
add("c-loop-continue", "C", "반복문과 continue", "easy", c(`
int sum = 0;
for (int i = 1; i <= 7; i++) {
    if (i % 3 == 0) continue;
    sum += i;
}
printf("%d", sum);`), "19", "3과 6은 continue로 건너뜁니다. 누적값은 1→3→7→12→19이므로 19를 출력합니다.");

add("c-nested-loop", "C", "중첩 반복문", "easy", c(`
int sum = 0;
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= i; j++) sum += i + j;
}
printf("%d", sum);`), "24", "i=1일 때 2, i=2일 때 3+4, i=3일 때 4+5+6을 더합니다. 합은 2+7+15=24입니다.");

add("c-array-update", "C", "배열의 순차 갱신", "easy", c(`
int a[] = {2, 4, 1, 3};
for (int i = 1; i < 4; i++) a[i] += a[i - 1];
printf("%d %d", a[2], a[3]);`), "7 10", "앞 원소의 갱신된 값을 사용하므로 배열은 {2, 6, 7, 10}이 됩니다. a[2]와 a[3]은 7과 10입니다.");

add("c-pointer-offset", "C", "포인터와 배열", "easy", c(`
int a[] = {4, 7, 10, 13};
int *p = a + 1;
*(p + 1) += *p;
printf("%d %d", a[2], *(p - 1));`), "17 4", "p는 a[1]을 가리킵니다. a[2]에 a[1]의 값 7을 더해 17이 되고, p-1은 a[0]이므로 4입니다.");

add("c-increment", "C", "전위와 후위 증가", "easy", c(`
int x = 3;
int a = x++;
int b = ++x;
printf("%d %d %d", x, a, b);`), "5 3 5", "a에는 증가 전 값 3이 저장되고 x는 4가 됩니다. ++x는 먼저 5로 증가시킨 뒤 b에 5를 저장합니다.");

add("c-switch", "C", "switch의 fall-through", "easy", c(`
int x = 2, sum = 0;
switch (x) {
    case 1: sum += 1;
    case 2: sum += 3;
    case 3: sum += 5; break;
    default: sum = -1;
}
printf("%d", sum);`), "8", "case 2에서 시작합니다. break가 없으므로 case 3도 실행해 3+5=8이 됩니다. x가 바뀌는지를 다시 검사하지 않습니다.");

add("c-string-index", "C", "문자 배열과 부분 문자열", "easy", c(`
char text[] = "PROGRAM";
text[3] = 'X';
printf("%c %s", text[1], text + 3);`), "R XRAM", "문자 배열은 PROXRAM으로 바뀝니다. text[1]은 R이고 text+3부터 널 문자 전까지 출력하면 XRAM입니다.");

add("c-bitmask", "C", "비트 연산", "easy", c(`
unsigned int x = 13, y = 6;
printf("%u %u %u", x & y, x ^ y, x >> 1);`), "4 11 6", "13은 이진수 1101, 6은 0110입니다. AND는 0100=4, XOR는 1011=11이며 13을 오른쪽으로 한 비트 이동하면 6입니다.");

add("c-call-by-value", "C", "함수의 값 전달", "easy", c(`
int x = 5;
int y = change(x);
printf("%d %d", x, y);`, `
int change(int n) {
    n += 4;
    return n;
}`), "5 9", "매개변수 n은 x의 복사본입니다. 함수는 9를 반환하지만 원래 변수 x는 5로 유지됩니다.");

add("c-struct-copy", "C", "구조체 대입", "easy", c(`
struct Point p = {2, 5};
struct Point q = p;
q.x += p.y;
printf("%d %d", p.x, q.x);`, "struct Point { int x; int y; };"), "2 7", "구조체 대입은 멤버 값을 복사합니다. q.x를 7로 바꾸어도 p.x는 2입니다.");

add("c-pointer-swap", "C", "포인터 매개변수", "medium", c(`
int a = 4, b = 9;
swap(&a, &b);
b += 2;
printf("%d %d", a, b);`, `
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`), "9 6", "주소로 전달된 원래 변수의 값을 교환해 a=9, b=4가 됩니다. 이후 b에 2를 더하므로 9 6입니다.");

add("c-pointer-postfix", "C", "포인터 증가와 역참조", "medium", c(`
int a[] = {5, 8, 11};
int *p = a;
int x = *p++;
int y = (*p)++;
printf("%d %d %d", x, y, a[1]);`), "5 8 9", "*p++는 *(p++)이므로 x=5를 읽고 p가 다음 원소로 이동합니다. (*p)++는 원소 자체를 후위 증가시켜 y=8, a[1]=9가 됩니다.");

add("c-2d-pointer", "C", "이차원 배열 포인터", "medium", c(`
int a[2][3] = {{1, 3, 5}, {2, 4, 6}};
int (*p)[3] = a;
p++;
printf("%d", (*p)[1] + *(*(p - 1) + 2));`), "9", "p++는 한 행을 건너뛰어 두 번째 행을 가리킵니다. (*p)[1]은 4, *(*(p-1)+2)는 첫 행의 세 번째 값 5이므로 합은 9입니다.");

add("c-string-size", "C", "strlen과 sizeof", "medium", c(`
char text[8] = "CODE";
printf("%d %d", (int)strlen(text), (int)sizeof(text));`), "4 8", "strlen은 널 문자 이전의 글자 수 4를 반환합니다. sizeof(text)는 선언된 문자 배열 전체의 크기인 8을 반환합니다.");

add("c-palindrome", "C", "문자열 비교 반복문", "medium", c(`
printf("%d %d", check("level"), check("paper"));`, `
int check(const char *s) {
    int left = 0, right = (int)strlen(s) - 1;
    while (left < right) {
        if (s[left] != s[right]) return 0;
        left++;
        right--;
    }
    return 1;
}`), "1 0", "양 끝에서 중앙으로 이동하며 같은 문자인지 검사합니다. level은 모든 대칭 문자가 같아 1이고, paper는 첫 비교 p와 r이 달라 0입니다.");

add("c-recursive-sum", "C", "재귀 호출의 누적", "medium", c(`
printf("%d", sum(7));`, `
int sum(int n) {
    if (n <= 0) return 0;
    return n + sum(n - 2);
}`), "16", "호출 인수는 7→5→3→1→-1로 줄어듭니다. 종료 시 0을 반환하고 1+3+5+7=16을 누적합니다.");

add("c-recursive-digits", "C", "정수 나눗셈과 재귀", "medium", c(`
printf("%d", digits(472));`, `
int digits(int n) {
    if (n == 0) return 0;
    return n % 10 + digits(n / 10);
}`), "13", "n%10으로 마지막 자릿수를 꺼내고 n/10으로 나머지 자릿수를 전달합니다. 2+7+4=13입니다.");

add("c-static-local", "C", "정적 지역 변수", "medium", c(`
int a = next();
int b = next();
int d = next();
printf("%d\\n%d\\n%d", a, b, d);`, `
int next(void) {
    static int n = 1;
    n *= 2;
    return n;
}`), "2\n4\n8", "static 지역 변수는 한 번만 초기화되고 호출 사이에 값을 유지합니다. 각 호출에서 2배가 되어 2, 4, 8을 반환하며 각 값이 한 줄씩 출력됩니다.");

add("c-short-circuit", "C", "논리 연산의 단락 평가", "medium", c(`
int x = 0, y = 2;
if (x && ++y) y += 10;
if (!x || ++y) y += 3;
printf("%d %d", x, y);`), "0 5", "첫 &&는 x가 0이므로 ++y를 실행하지 않습니다. 다음 ||는 !x가 참이므로 역시 ++y를 생략하고 본문의 y+=3만 실행합니다.");

add("c-array-parameter", "C", "배열 인수와 일반 인수", "medium", c(`
int a[] = {1, 2, 3};
int n = 3;
alter(a, n);
printf("%d %d", a[1], n);`, `
void alter(int a[], int n) {
    a[1] += n;
    n = 0;
}`), "5 3", "배열 매개변수로 원래 배열을 수정하므로 a[1]=5가 됩니다. n은 값으로 전달되어 함수 내부의 n=0이 호출자의 n=3을 바꾸지 않습니다.");

add("c-linked-structure", "C", "연결된 구조체 순회", "hard", c(`
struct Node a = {3, NULL};
struct Node b = {5, &a};
struct Node d = {7, &b};
struct Node *p = &d;
int sum = 0;
while (p != NULL) {
    sum += p->value;
    p = p->next;
}
printf("%d", sum);`, "struct Node { int value; struct Node *next; };"), "15", "포인터는 d→b→a→NULL 순서로 이동합니다. 화살표로 읽은 값 7, 5, 3을 더해 15가 됩니다.");

add("c-double-pointer", "C", "이중 포인터", "hard", c(`
int a = 3, b = 8;
int *p = &a;
redirect(&p, &b);
printf("%d %d %d", a, b, *p);`, `
void redirect(int **p, int *q) {
    *p = q;
    **p += 2;
}`), "3 10 10", "&p를 전달하므로 *p=q는 호출자의 포인터를 b의 주소로 바꿉니다. **p+=2는 b를 10으로 만들고 a는 3으로 유지됩니다.");

add("c-function-pointer", "C", "함수 포인터 배열", "hard", c(`
int (*f[2])(int, int) = {add, multiply};
int value = f[0](2, 3);
printf("%d", f[1](value, 4));`, `
int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }`), "20", "f[0]은 add를 호출하여 5를 반환합니다. f[1]은 multiply이므로 5×4=20을 출력합니다.");

add("c-recursion-order", "C", "재귀 호출 전후의 출력 순서", "hard", c(`
trace(3);`, `
void trace(int n) {
    if (n == 0) return;
    printf("%d", n);
    trace(n - 1);
    printf("%d", n);
}`), "321123", "재귀 진입 전에 3, 2, 1을 출력하고 반환하며 1, 2, 3을 출력합니다. 출력 사이에 공백은 없으므로 321123입니다.");

add("c-recursive-pointer", "C", "포인터 이동과 재귀", "hard", c(`
int a[] = {2, 5, 8, 11};
printf("%d", sum(a + 1, 3) - a[0]);`, `
int sum(const int *p, int n) {
    if (n == 0) return 0;
    return *p + sum(p + 1, n - 1);
}`), "22", "a+1부터 3개 원소 5, 8, 11을 누적해 24를 반환합니다. a[0]의 값 2를 빼서 22입니다.");

add("c-struct-array", "C", "구조체 배열과 함수", "hard", c(`
struct Score a[] = {{2, 3}, {4, 1}};
for (int i = 0; i < 2; i++) update(&a[i]);
printf("%d %d", a[0].a + a[1].a, a[0].b + a[1].b);`, `
struct Score { int a; int b; };
void update(struct Score *p) {
    p->a += p->b;
    p->b--;
}`), "10 2", "구조체들은 {5, 2}, {5, 0}으로 바뀝니다. 첫 멤버끼리의 합은 10이고 두 번째 멤버끼리의 합은 2입니다.");

add("c-scope-static", "C", "변수 범위와 static", "hard", c(`
int x = 8;
int a = value();
int b = value();
printf("%d %d %d", x, a, b);`, `
int x = 4;
int value(void) {
    static int x = 1;
    return ++x;
}`), "8 2 3", "main의 지역 x=8은 전역 x를 가립니다. value의 별도 static x는 1에서 시작하여 2, 3으로 증가하며 main의 x와는 무관합니다.");

add("c-string-pointer-array", "C", "문자열 포인터 배열", "hard", c(`
const char *words[] = {"STONE", "WATER", "FIRE"};
const char **p = words + 1;
printf("%c %s", (*p)[2], *(p + 1) + 1);`), "T IRE", "p는 WATER의 포인터를 가리켜 (*p)[2]는 T입니다. *(p+1)은 FIRE이고 여기에 1을 더한 주소부터 출력하면 IRE입니다.");

add("c-recursive-gcd", "C", "재귀와 나머지 연산", "hard", c(`
printf("%d", gcd(84, 30) + gcd(21, 14));`, `
int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}`), "13", "첫 호출은 (84,30)→(30,24)→(24,6)→(6,0)으로 6을 반환합니다. 두 번째는 7을 반환하여 합은 13입니다.");

add("c-insertion-sort", "C", "정렬과 배열 이동", "hard", c(`
int a[] = {7, 2, 5, 1};
for (int i = 1; i < 4; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
    }
    a[j + 1] = key;
}
printf("%d %d", a[1], a[3]);`), "2 7", "각 단계에서 key보다 큰 원소를 오른쪽으로 옮깁니다. 배열은 {2,7,5,1}→{2,5,7,1}→{1,2,5,7}이 되어 2와 7을 출력합니다.");

add("java-integer-division", "Java", "정수 나눗셈과 나머지", "easy", java(`
int x = 17, y = 4;
System.out.print((x / y) + ":" + (x % y));`), "4:1", "정수 나눗셈 17/4는 4이고 나머지는 1입니다. 문자열 ':'와 연결하여 4:1을 출력합니다.");

add("java-nested-loop", "Java", "중첩 반복문", "easy", java(`
int sum = 0;
for (int i = 1; i <= 3; i++) {
    for (int j = 0; j < i; j++) sum += i;
}
System.out.print(sum);`), "14", "각 i를 i번 더합니다. 1×1+2×2+3×3=14입니다.");

add("java-array-update", "Java", "배열의 순차 갱신", "easy", java(`
int[] a = {3, 1, 4, 2};
for (int i = 1; i < a.length; i++) a[i] += a[i - 1];
System.out.print(Arrays.toString(a));`), "[3, 4, 8, 10]", "이미 갱신된 앞 원소를 더하므로 a[1]=4, a[2]=8, a[3]=10입니다. Arrays.toString은 배열 내용을 대괄호와 쉼표로 출력합니다.");

add("java-substring", "Java", "문자열 인덱스", "easy", java(`
String s = "ABCDEFG";
String t = s.substring(1, 6);
System.out.print(t.substring(1, 4));`), "CDE", "첫 substring은 인덱스 1~5의 BCDEF를 반환합니다. 새 문자열의 인덱스 1~3은 CDE이며 끝 인덱스는 포함하지 않습니다.");

add("java-concatenation", "Java", "덧셈과 문자열 연결", "easy", java(`
int x = 2, y = 3;
System.out.print(x + y + " " + x + y);`), "5 23", "+는 왼쪽부터 계산합니다. x+y는 숫자 5이고, 문자열과 연결된 뒤의 x와 y는 각각 문자로 붙어서 '5 23'이 됩니다.");

add("java-switch", "Java", "switch의 fall-through", "easy", java(`
int x = 2, sum = 0;
switch (x) {
    case 1: sum += 1;
    case 2: sum += 2;
    case 3: sum += 3; break;
    default: sum = -1;
}
System.out.print(sum);`), "5", "case 2에서 시작하여 break가 있는 case 3까지 이어서 실행합니다. 합은 2+3=5입니다.");

add("java-short-circuit", "Java", "단락 평가와 부수 효과", "easy", java(`
int x = 0, y = 1;
if (x > 0 && ++y > 1) y += 10;
if (x == 0 || ++y > 1) y += 2;
System.out.print(x + " " + y);`), "0 3", "&&의 왼쪽은 거짓, ||의 왼쪽은 참이므로 두 ++y는 모두 실행하지 않습니다. 마지막 본문에서 y에 2만 더해 3입니다.");

add("java-increment", "Java", "전위와 후위 증가", "easy", java(`
int x = 4;
int a = x++;
int b = ++x;
System.out.print(x + " " + a + " " + b);`), "6 4 6", "a는 증가 전 값 4를 받습니다. x가 5가 된 뒤 ++x에서 6으로 증가하므로 x=6, b=6입니다.");

add("java-array-alias", "Java", "배열 참조 공유", "easy", java(`
int[] a = {2, 4, 6};
int[] b = a;
b[1] = b[0] + b[2];
System.out.print(a[1] + " " + b[1]);`), "8 8", "a와 b는 같은 배열을 참조합니다. b[1]을 8로 수정하면 a[1]로 읽어도 같은 8입니다.");

add("java-string-immutable", "Java", "문자열의 불변성", "easy", java(`
String s = "JAVA";
s.replace('A', 'O');
String t = s.substring(1);
System.out.print(s + " " + t);`), "JAVA AVA", "replace는 새 문자열을 반환하지만 s에 대입하지 않아 s는 JAVA입니다. substring(1)은 AVA를 반환합니다.");

add("java-overloading", "Java", "메서드 오버로딩", "medium", java(`
System.out.print(f(3) + " " + f("3"));`, `
static int f(int x) { return x + 2; }
static String f(String x) { return x + "2"; }`), "5 32", "정수 인수에는 f(int)를 호출하여 5를 얻습니다. 문자열 인수에는 f(String)을 호출하여 문자열 32를 얻습니다.");

add("java-super-method", "Java", "오버라이딩과 super", "medium", java(`
Parent p = new Child();
System.out.print(p.value());`, "", `
class Parent { int value() { return 3; } }
class Child extends Parent {
    int value() { return super.value() + 4; }
}`), "7", "실제 객체가 Child이므로 재정의한 메서드를 실행합니다. super.value()로 부모의 3을 얻고 4를 더해 7을 반환합니다.");

add("java-field-hiding", "Java", "필드 숨김과 동적 바인딩", "medium", java(`
Parent p = new Child();
System.out.print(p.x + " " + p.value());`, "", `
class Parent {
    int x = 2;
    int value() { return x; }
}
class Child extends Parent {
    int x = 7;
    int value() { return x; }
}`), "2 7", "필드 p.x는 참조 변수의 선언 타입 Parent에 따라 2를 읽습니다. 인스턴스 메서드는 실제 객체 Child의 구현을 호출하여 7을 반환합니다.");

add("java-constructor-chain", "Java", "생성자 호출 순서", "medium", java(`
new Child();
System.out.print("C");`, "", `
class Parent { Parent() { System.out.print("A"); } }
class Child extends Parent { Child() { System.out.print("B"); } }`), "ABC", "자식 생성자는 부모 생성자를 먼저 호출합니다. Parent의 A, Child의 B, main의 C 순서로 출력합니다.");

add("java-array-parameter", "Java", "참조값 전달과 재대입", "medium", java(`
int[] a = {1, 2};
alter(a);
System.out.print(a[0] + " " + a[1]);`, `
static void alter(int[] a) {
    a[0] = 9;
    a = new int[] {4, 5};
    a[1] = 8;
}`), "9 2", "전달된 참조값으로 원래 배열의 첫 원소를 9로 바꿉니다. 매개변수 a에 새 배열을 대입해도 호출자의 참조는 그대로여서 두 번째 원소는 2입니다.");

add("java-list-removal", "Java", "컬렉션과 오버로딩", "medium", java(`
List<Integer> a = new ArrayList<>(Arrays.asList(1, 2, 3, 2));
a.remove(1);
a.remove(Integer.valueOf(2));
System.out.print(a);`), "[1, 3]", "remove(1)은 인덱스 1의 원소를 지워 [1,3,2]가 됩니다. remove(Integer.valueOf(2))는 값이 2인 원소를 지워 [1,3]이 됩니다.");

add("java-static-shared", "Java", "정적 필드와 인스턴스 필드", "medium", java(`
Counter a = new Counter();
Counter b = new Counter();
System.out.println(a.id);
System.out.println(b.id);
System.out.print(Counter.count);`, "", `
class Counter {
    static int count = 0;
    int id;
    Counter() { id = ++count; }
}`), "1\n2\n2", "count는 모든 인스턴스가 공유하므로 1, 2로 증가합니다. 각 객체의 id에는 생성 시 값이 따로 저장되어 1과 2입니다. 각 출력문으로 1, 2, 2를 한 줄씩 출력합니다.");

add("java-exception-finally", "Java", "예외와 finally의 실행 순서", "medium", java(`
try {
    System.out.print("A");
    int[] a = {1};
    System.out.print(a[1]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.print("B");
} finally {
    System.out.print("C");
}
System.out.print("D");`), "ABCD", "A 출력 뒤 잘못된 배열 인덱스에서 예외가 발생합니다. catch에서 B, finally에서 C를 출력한 뒤 다음 문장의 D를 출력합니다.");

add("java-string-equality", "Java", "문자열 참조와 내용 비교", "medium", java(`
String a = "JAVA";
String b = new String("JAVA");
System.out.print((a == b) + " " + a.equals(b));`), "false true", "new String은 별도 객체를 만듭니다. ==는 참조를 비교하여 false이며 equals는 문자열 내용을 비교하므로 true입니다.");

add("java-recursion", "Java", "재귀 호출", "medium", java(`
System.out.print(f(6));`, `
static int f(int n) {
    if (n <= 1) return n;
    return f(n - 1) + f(n - 2);
}`), "8", "f(0)=0, f(1)=1에서 시작해 앞의 두 값을 더합니다. f(2)~f(6)은 1, 2, 3, 5, 8입니다.");

add("java-overload-declared-type", "Java", "오버로딩과 선언 타입", "hard", java(`
Parent x = new Child();
Child y = new Child();
System.out.print(f(x) + f(y));`, `
static String f(Parent p) { return "A"; }
static String f(Child p) { return "B"; }`, `
class Parent {}
class Child extends Parent {}`), "AB", "오버로딩 선택은 인수의 선언 타입으로 결정합니다. x는 Parent 타입이어서 A, y는 Child 타입이어서 B를 반환합니다. 오버라이딩의 동적 바인딩과 구분해야 합니다.");

add("java-dynamic-inner-call", "Java", "상속 메서드 내부의 동적 바인딩", "hard", java(`
Parent p = new Child();
System.out.print(p.second());`, "", `
class Parent {
    int first() { return 2; }
    int second() { return first() + 1; }
}
class Child extends Parent { int first() { return 5; } }`), "6", "second는 부모에게서 상속했지만 내부의 first() 호출도 실제 객체 Child의 재정의 메서드를 사용합니다. 따라서 5+1=6입니다.");

add("java-super-constructor", "Java", "super 생성자와 상속 필드", "hard", java(`
Parent p = new Child();
System.out.print("=" + p.x);`, "", `
class Parent {
    int x;
    Parent(int n) { x = n; System.out.print("P" + x); }
}
class Child extends Parent {
    Child() {
        super(3);
        x += 2;
        System.out.print("C" + x);
    }
}`), "P3C5=5", "부모 생성자에서 x=3으로 만들고 P3을 출력합니다. 자식이 상속받은 같은 필드를 5로 바꾸며 C5를 출력하고 main에서 =5를 덧붙입니다.");

add("java-initialization-order", "Java", "정적 초기화와 인스턴스 초기화", "hard", java(`
new Main();
new Main();`, `
static { System.out.print("S"); }
{ System.out.print("I"); }
Main() { System.out.print("C"); }`), "SICIC", "클래스 초기화 시 static 블록 S는 한 번만 실행합니다. 객체를 만들 때마다 인스턴스 초기화 블록 I와 생성자 C가 순서대로 실행합니다.");

add("java-finally-return", "Java", "return과 finally", "hard", java(`
System.out.print(f());`, `
static int f() {
    int x = 1;
    try {
        return x;
    } finally {
        x = 7;
        System.out.print(x + " ");
    }
}`), "7 1", "return 표현식의 값 1을 먼저 보관합니다. finally에서 x=7을 출력해도 이미 결정된 반환값은 1이므로 7 1입니다.");

add("java-shallow-array-copy", "Java", "객체 배열의 얕은 복사", "hard", java(`
Box[] a = {new Box(2), new Box(5)};
Box[] b = a.clone();
b[0].value += 3;
b[1] = new Box(9);
System.out.print(a[0].value + " " + a[1].value + " " + b[1].value);`, "", `
class Box {
    int value;
    Box(int value) { this.value = value; }
}`), "5 5 9", "배열은 복사되지만 원소의 객체 참조는 공유합니다. 첫 객체의 값 변경은 a에서도 보입니다. b[1]에 새 객체를 대입하는 것은 a[1]을 바꾸지 않아 5 5 9입니다.");

add("java-constructor-dispatch", "Java", "생성 중 메서드 호출과 필드 초기화", "hard", java(`
new Child();`, "", `
class Parent {
    Parent() { System.out.print(value() + " "); }
    int value() { return 2; }
}
class Child extends Parent {
    int x = 7;
    Child() { System.out.print(value()); }
    int value() { return x; }
}`), "0 7", "부모 생성자에서 호출해도 Child.value()가 실행됩니다. 이때 자식의 x=7 초기화 전이어서 기본값 0을 읽습니다. 자식 생성자 본문에서는 초기화된 값 7을 읽습니다.");

add("java-static-hiding", "Java", "정적 메서드와 인스턴스 메서드", "hard", java(`
Parent p = new Child();
System.out.print(Parent.name() + Child.name() + p.value());`, "", `
class Parent {
    static String name() { return "A"; }
    String value() { return "P"; }
}
class Child extends Parent {
    static String name() { return "B"; }
    String value() { return "C"; }
}`), "ABC", "클래스 이름으로 호출한 정적 메서드는 각각 A와 B를 반환합니다. p.value()는 실제 객체 Child의 인스턴스 메서드를 호출하므로 C입니다.");

add("java-interface-default", "Java", "인터페이스와 재정의", "hard", java(`
Calc c = new Twice();
System.out.print(c.apply(3));`, "", `
interface Calc {
    default int apply(int x) { return x + 1; }
}
class Twice implements Calc {
    public int apply(int x) { return x * 2; }
}`), "6", "인터페이스 타입으로 참조해도 실제 객체 Twice가 재정의한 apply를 사용합니다. 기본 메서드의 4 대신 3×2=6을 반환합니다.");

add("java-exception-propagation", "Java", "예외 전파와 finally", "hard", java(`
try {
    f();
} catch (IllegalArgumentException e) {
    System.out.print("D");
}`, `
static void f() {
    try {
        System.out.print("A");
        throw new IllegalArgumentException();
    } catch (RuntimeException e) {
        System.out.print("B");
        throw e;
    } finally {
        System.out.print("C");
    }
}`), "ABCD", "A 출력 후 예외를 RuntimeException catch에서 받아 B를 출력하고 다시 던집니다. 전파 전에 finally의 C를 출력하며 main의 catch에서 D를 출력합니다.");

add("python-negative-slice", "Python", "음수 간격 슬라이싱", "easy", `
s = "ABCDEFGH"
print(s[6:0:-2])`, "GEC", "인덱스 6, 4, 2의 G, E, C를 추출합니다. 끝 인덱스 0은 포함하지 않으므로 A는 제외합니다.");

add("python-range-continue", "Python", "range와 continue", "easy", `
total = 0
for n in range(2, 10, 2):
    if n == 6:
        continue
    total += n
print(total)`, "14", "range는 2, 4, 6, 8을 생성하며 10은 제외합니다. 6을 건너뛰어 2+4+8=14입니다.");

add("python-nested-loop", "Python", "중첩 반복문", "easy", `
total = 0
for i in range(1, 4):
    for j in range(i):
        total += i + j
print(total)`, "18", "i=1에서 1, i=2에서 2+3, i=3에서 3+4+5를 더합니다. 합은 1+5+12=18입니다.");

add("python-list-update", "Python", "리스트 추가와 집계", "easy", `
a = [2, 3, 4]
a.append(a[0] + a[1])
print(a[-1], sum(a))`, "5 14", "append로 5를 추가해 리스트는 [2,3,4,5]가 됩니다. 마지막 원소는 5, 전체 합은 14입니다.");

add("python-list-alias", "Python", "리스트 참조 공유", "easy", `
a = [1, 2, 3]
b = a
b[1] = 9
print(a)`, "[1, 9, 3]", "b=a는 리스트 복사가 아니라 같은 객체의 참조 공유입니다. b의 인덱스 1을 바꾸면 a에서도 9로 보입니다.");

add("python-slice-copy", "Python", "슬라이싱과 복사", "easy", `
a = [2, 4, 6]
b = a[1:]
b[0] = 8
print(a[1], b[0])`, "4 8", "슬라이싱은 새 리스트 [4,6]을 만듭니다. b[0]을 바꾸어도 a[1]은 4로 유지되어 4 8을 출력합니다.");

add("python-split-join", "Python", "문자열 분리와 결합", "easy", `
s = "red-blue-red"
parts = s.split("-")
print("/".join(parts[::2]))`, "red/red", "split으로 ['red','blue','red']가 되고 [::2]로 두 red를 고릅니다. '/'로 연결하면 red/red입니다.");

add("python-dictionary-get", "Python", "딕셔너리 조회와 기본값", "easy", `
d = {"a": 2, "b": 3}
d["a"] += d.get("c", 4)
print(d["a"], len(d))`, "6 2", "없는 키 c에 대해 get은 기본값 4를 반환하며 키를 추가하지 않습니다. a의 값은 6, 딕셔너리 길이는 2입니다.");

add("python-floor-mod", "Python", "음수의 몫과 나머지", "easy", `
print(-7 // 3, -7 % 3)`, "-3 2", "//는 0 방향 절삭이 아니라 내림이므로 -7/3의 몫은 -3입니다. -7=(-3)×3+2이므로 나머지는 2입니다.");

add("python-loop-else", "Python", "for-else", "easy", `
for n in range(2, 6):
    if n % 7 == 0:
        print("FOUND")
        break
else:
    print("NONE")`, "NONE", "2~5 중 7의 배수가 없어 break 없이 반복이 끝납니다. for의 else가 실행되어 대문자 NONE을 출력합니다.");

add("python-comprehension", "Python", "조건부 리스트 컴프리헨션", "medium", `
a = [n * n for n in range(1, 7) if n % 2 == 0]
print(a)`, "[4, 16, 36]", "1~6 중 짝수 2, 4, 6을 고른 뒤 각 값을 제곱해 [4,16,36]을 만듭니다.");

add("python-nested-comprehension", "Python", "중첩 컴프리헨션", "medium", `
a = [i + j for i in range(2) for j in range(3) if i != j]
print(a)`, "[1, 2, 1, 3]", "i=0일 때 j=1,2에서 1,2를 만들고 i=1일 때 j=0,2에서 1,3을 만듭니다. 앞의 for가 바깥 반복문입니다.");

add("python-unpacking", "Python", "동시 대입", "medium", `
a, b = 2, 5
a, b = b, a + b
print(a, b)`, "5 7", "오른쪽 표현식을 기존 값으로 먼저 계산하여 (5,7)을 얻은 뒤 왼쪽 변수에 대입합니다. a를 먼저 바꾼 값으로 a+b를 계산하지 않습니다.");

add("python-list-parameter", "Python", "가변 객체 전달과 재대입", "medium", `
def change(values):
    values.append(4)
    values = [9]

a = [1, 2]
change(a)
print(a)`, "[1, 2, 4]", "append는 공유 중인 원래 리스트를 수정합니다. 매개변수 values에 [9]를 다시 대입해도 호출자의 a는 [1,2,4]를 참조합니다.");

add("python-default-argument", "Python", "가변 기본 인수", "medium", `
def add(x, bag=[]):
    bag.append(x)
    return len(bag)

print(add(1))
print(add(2))
print(add(3, []))`, "1\n2\n1", "기본 리스트는 함수 정의 시 한 번 만들어져 첫 두 호출에서 공유됩니다. 세 번째 호출은 별도의 빈 리스트를 전달하므로 길이는 1입니다. 출력은 각 줄에 1, 2, 1입니다.");

add("python-recursion", "Python", "재귀 반환값", "medium", `
def f(n):
    if n <= 1:
        return 1
    return n * f(n - 1)

print(f(5))`, "120", "f(1)=1을 기준으로 반환하며 2, 6, 24, 120을 차례로 계산합니다. f(5)는 5×4×3×2×1=120입니다.");

add("python-sorted-key", "Python", "정렬 키와 lambda", "medium", `
a = ["bbb", "a", "cc", "dd"]
b = sorted(a, key=lambda x: (len(x), x))
print(" ".join(b))`, "a cc dd bbb", "길이를 먼저 비교하고 같은 길이는 문자열 순서로 비교합니다. 길이 1의 a, 길이 2의 cc와 dd, 길이 3의 bbb 순서입니다.");

add("python-set-operations", "Python", "집합 연산", "medium", `
a = {1, 2, 3, 4}
b = {3, 4, 5}
print(sorted((a | b) - (a & b)))`, "[1, 2, 5]", "합집합은 {1,2,3,4,5}, 교집합은 {3,4}입니다. 합집합에서 교집합을 빼고 정렬해 [1,2,5]를 출력합니다.");

add("python-zip-enumerate", "Python", "zip과 enumerate", "medium", `
a = [2, 4, 6]
b = [1, 3, 5]
total = 0
for i, (x, y) in enumerate(zip(a, b), start=1):
    total += i * (x - y)
print(total)`, "6", "zip은 (2,1), (4,3), (6,5)를 만듭니다. enumerate의 번호 1,2,3에 차이 1을 각각 곱해 1+2+3=6입니다.");

add("python-exception-finally", "Python", "예외와 finally", "medium", `
try:
    print("A", end="")
    int("x")
except ValueError:
    print("B", end="")
finally:
    print("C", end="")
print("D")`, "ABCD", "A 출력 후 int('x')에서 ValueError가 발생합니다. except의 B, finally의 C, 마지막 D가 이어서 출력됩니다.");

add("python-shallow-copy", "Python", "중첩 리스트의 얕은 복사", "hard", `
a = [[1, 2], [3, 4]]
b = a[:]
b[0].append(5)
b[1] = [9]
print(a)`, "[[1, 2, 5], [3, 4]]", "바깥 리스트만 복사되어 안쪽 리스트는 공유합니다. append는 a[0]에도 반영됩니다. b[1]의 재대입은 복사된 바깥 리스트만 바꾸어 a[1]은 유지됩니다.");

add("python-list-multiplication", "Python", "리스트 반복과 참조", "hard", `
a = [[0] * 2] * 3
a[1][0] = 7
print(a)`, "[[7, 0], [7, 0], [7, 0]]", "바깥 리스트의 세 원소가 같은 안쪽 리스트를 가리킵니다. 그 리스트의 첫 값을 7로 바꾸므로 세 행 모두 [7,0]으로 보입니다.");

add("python-class-shared", "Python", "클래스 변수와 인스턴스 변수", "hard", `
class Box:
    items = []
    def __init__(self):
        self.count = 0
    def add(self, value):
        self.items.append(value)
        self.count += 1

a = Box()
b = Box()
a.add(2)
b.add(4)
print(a.items, a.count, b.count)`, "[2, 4] 1 1", "items는 클래스의 공유 리스트여서 [2,4]가 됩니다. count는 각 객체에 별도로 생성되어 두 객체 모두 1입니다.");

add("python-inheritance", "Python", "상속과 super", "hard", `
class Parent:
    def __init__(self):
        self.x = 2
    def value(self):
        return self.x + 1

class Child(Parent):
    def __init__(self):
        super().__init__()
        self.x += 3
    def value(self):
        return super().value() * 2

print(Child().value())`, "12", "부모 초기화 후 self.x에 3을 더해 5가 됩니다. super().value()도 같은 객체의 x=5를 읽어 6을 반환하며 자식이 2배로 만들어 12입니다.");

add("python-closure", "Python", "클로저와 nonlocal", "hard", `
def outer(x):
    def inner(y):
        nonlocal x
        x += y
        return x
    return inner

f = outer(3)
print(f(2), f(4))`, "5 9", "inner는 바깥 함수의 x를 유지합니다. nonlocal로 그 x를 수정하므로 첫 호출에서 5, 다음 호출에서 9가 됩니다.");

add("python-recursive-list", "Python", "슬라이싱과 재귀", "hard", `
def f(a):
    if not a:
        return 0
    return a[0] - f(a[1:])

print(f([8, 3, 2, 1]))`, "6", "재귀는 8-(3-(2-(1-0)))로 계산합니다. 안쪽부터 1, 1, 2, 6을 반환하여 최종 결과는 6입니다.");

add("python-generator", "Python", "제너레이터의 소비", "hard", `
def values():
    for n in range(4):
        yield n * n

g = values()
print(next(g), sum(g))`, "0 14", "next(g)가 첫 값 0을 소비합니다. sum(g)는 남은 값 1,4,9만 더하므로 14입니다. 제너레이터는 다시 처음부터 시작하지 않습니다.");

add("python-dictionary-count", "Python", "딕셔너리 집계와 정렬", "hard", `
counts = {}
for ch in "BANANA":
    counts[ch] = counts.get(ch, 0) + 1
print(" ".join(f"{k}:{counts[k]}" for k in sorted(counts)))`, "A:3 B:1 N:2", "문자별 횟수는 A=3, B=1, N=2입니다. sorted(counts)는 키를 A,B,N 순서로 정렬하고 해당 횟수를 문자열로 결합합니다.");

add("python-nested-break", "Python", "중첩 반복문의 break 범위", "hard", `
total = 0
for i in range(1, 4):
    for j in range(1, 4):
        if i + j == 4:
            break
        total += i * j
print(total)`, "5", "break는 안쪽 반복문만 끝냅니다. i=1에서 1과 2를 더하고, i=2에서 2를 더하며, i=3에서는 바로 break하여 합은 5입니다.");

add("python-finally-return", "Python", "반환 객체와 finally", "hard", `
def f():
    a = [1]
    try:
        return a
    finally:
        a.append(2)

print(f())`, "[1, 2]", "return은 리스트 객체의 참조를 반환할 준비를 합니다. 반환 전 finally가 같은 객체에 2를 추가하므로 호출자가 받는 리스트는 [1,2]입니다.");

export const PROGRAMMING_EXERCISES: readonly ProgrammingExercise[] = exercises;

export const PROGRAMMING_QUESTIONS: QuestionTemplate[] = exercises.map((exercise) => {
  const languageLabel = exercise.language === "Python" ? "Python 3" : exercise.language === "C" ? "C언어" : "Java";
  const instruction = `다음 ${languageLabel} 코드의 실행 결과를 쓰시오. 출력 순서와 대소문자를 지키고, 여러 값은 공백이나 줄바꿈으로 구분하시오.`;
  return {
    topicId: "programming-languages", keyword: `${exercise.language} · ${exercise.concept}`,
    difficulty: exercise.difficulty, type: "short", prompt: `${instruction}\n\n${exercise.source}`,
    code: { language: exercise.language, source: exercise.source }, answerFormat: "code-output",
    answer: exercise.answer, explanation: exercise.explanation,
  };
});
