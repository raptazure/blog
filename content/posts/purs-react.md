---
title: Purs React
date: 2020-10-21
tags:
  - functional
---

## 1. React with PureScript

- Clone [create-react-app-purescript](https://github.com/andys8/create-react-app-purescript). Run `npm install` or `yarn install`.
- Step by step instructions: 
  - Create react application with TypeScript.
  ```shell
  npx create-react-app create-react-app-purescript --template typescript
  ```
  - Follow [the craco guide](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation) to overwrite parts of the `create-react-app` configuration.
  - Extend craco configuration to use [`craco-purescript-loader`](https://github.com/andys8/craco-purescript-loader).
  - Install PureScript (compiler) and initialize spago (package manager).
  ```shell
  npm install purescript spago --save-dev
  npx spago init
  ```
  - Add npm script in `package.json` and install dependencies with `npm install`.
  ```json
  {
    "postinstall": "spago build --deps-only"
  }
  ```
  - Install [`react-basic`](https://github.com/lumihq/purescript-react-basic) and [`react-basic-hooks`](https://github.com/spicydonuts/purescript-react-basic-hooks).
  ```shell
  npx spago install react-basic react-basic-dom react-basic-hooks
  ```
  - Add a PureScript component: `Counter.ps`.
  ```haskell
  module Counter where

  import Prelude
  import Effect (Effect)
  import Effect.Unsafe (unsafePerformEffect)
  import React.Basic.DOM as R
  import React.Basic.Events (handler_)
  import React.Basic.Hooks
  import React.Basic.Hooks as React

  mkCounter :: ReactComponent {}
  mkCounter = unsafePerformEffect counter

  counter :: Effect (ReactComponent {})
  counter = do
    reactComponent "Counter" \_ -> React.do
      count /\ setCount <- useState 0
      let
        handleClick = handler_ <<< setCount
      pure
        $ R.div_
            [ R.button { 
              onClick: handleClick (_ - 1), 
              children: [ R.text "-" ] }
            , R.div_ [ R.text (show count) ]
            , R.button { onClick: handleClick (_ + 1), 
            children: [ R.text "+" ] }
            ]
  ```
  - Allow module import in TS: `purescript-module.d.ts`.
  - Import the component and use it: `App.tsx`.

  ```tsx
  import { mkCounter as Counter } from "./Counter.purs";
  // ...
  function App() {
    return <Counter />;
  }
  ```
- [`purescript-tsd-gen`](https://github.com/minoki/purescript-tsd-gen): TypeScript Declaration File (.d.ts) generator for PureScript. It helps to use PureScript modules from TypeScript. However it does not support higher-kinded types currently because emulating HKT in TypeScript is a little bit complicated. But maybe we can have a look at the implementation of [`fp-ts`](https://github.com/gcanti/fp-ts).
- Some examples:
  - [`purescript-react-realworld`](https://github.com/jonasbuntinx/purescript-react-realworld): A real world implementation of Conduit.
  - [`gatsby-purescript-example`](https://github.com/jonasbuntinx/gatsby-purescript-example): Simple example app using Gatsby.js with PureScript.
  - [`next-purescript-example`](https://github.com/jonasbuntinx/next-purescript-example):  Simple example app using Next.js with PureScript.
 
## 2. React Native with PureScript

- `create-react-native-app purescript-app`
- `pulp init --force`
- `pulp build` 
- `src/Main.js`
```javascript
var React = require("react");
var RN = require("react-native");

exports.text = function(props){
  return function(str){
    return React.createElement(RN.Text, props, str); 
  };
};
```
- `src/Main.purs`
```haskell
module Main where

foreign import data ReactElement :: Type

foreign import text :: forall props. props -> String -> ReactElement

main :: ReactElement
main = text { 
  style : { 
    color : "green", 
    fontSize : 50 
    } 
  } "Hello from PureScript!" 
```
- `./App.js`
```javascript
import React from 'react';
import Main from "./output/Main";

export default class App extends React.Component {
  render() {
    return Main.main;
  }
}
```
- `pulp build`
- `yarn start` (npm may also work)
