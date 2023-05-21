# Proxy
Placed in `angular.json` here:

```json
"serve": {
    ...,
    "options": {
        "proxyConfig": "projects/hyp-app/proxy.conf.json"
    },
    ...,
}
```

# Compiler Options

https://stackoverflow.com/questions/49699067/property-has-no-initializer-and-is-not-definitely-assigned-in-the-construc

"strictPropertyInitialization": false,

# Theme
Need to put `@import "../../../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css"` at top of 
`styles.scss`.