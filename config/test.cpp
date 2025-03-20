// ## Bài 2
// #include<bits/stdc++.h>
// using namespace std;

// int main(){
//   long long T;
//   cin >> T;
//   T = (T >= 5000000) ? (T * 0.8): (T >= 2000000 ? (T * 0.9) : T);
//   cout << T; 
//   return 0;
// }

// ## Bài 3
// #include<bits/stdc++.h>
// using namespace std;

// int main() {
//   long long L, R, cnt = 0;
//   cin >> L >> R;
//   if(L % 2 == 1) L++;
//   for (long long i = L; i <= R; i += 2, cnt++) cout << i << (cnt % 10 == 9 ? "\n" : " ");
//   return 0;
// }

// ## Bài 4
#include<bits/stdc++.h>
using namespace std;

int main() {
  int n, cnt = 0;
  cin >> n;
  for (int i = 1; i <= n; i *= 10) cnt += (n - i + 1);
  cout << cnt;
  return 0;
}
