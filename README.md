# USC-Annenberg-App-2023sp

In case of problems,
uninstall ios/Podfile.lock, ios/Pods/*, ios/build/*,

and run `pod install` in `ios/`

Once successful, open `ios/AnnenbergMedia.xcworkspace` in XCode, and run.

If there is a `hash.hpp` error about `struct hash_base : std::unary_function<T, std::size_t> {};`,
replace with `struct hash_base : std::__unary_function<T, std::size_t> {};` cuz unary_function got updated.

While doing the Archive thing in XCode : ensure you do the Solution 1 in this article (only thing which works, do not even try messing around in Podfile or Targets Build Phases or Copy Bundle Resources or anything):
https://copyprogramming.com/howto/xcode-12-error-multiple-commands-produce-accessibilityresources-bundle
 
[ removing  React-Core.common-AccessibilityResources  from the Pods project ]

