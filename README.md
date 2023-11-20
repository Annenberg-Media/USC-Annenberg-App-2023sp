# USC-Annenberg-App-2023sp

In case of problems,
uninstall ios/Podfile.lock, ios/Pods/*, ios/build/*,

and run `pod install` in `ios/`

Once successful, open `ios/AnnenbergMedia.xcworkspace` in XCode, and run.

If there is a `hash.hpp` error about `struct hash_base : std::unary_function<T, std::size_t> {};`,
replace with `struct hash_base : std::__unary_function<T, std::size_t> {};` cuz unary_function got updated

