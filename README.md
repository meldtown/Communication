# Backend enums

```
// typeId
public enum MessageType {
	standard = 1,
	invite = 4,
	decline = 6,
	offer = 3,
	apply = 2,
	unoffer = 5
}
```

# Styles

http://frontender.info/bem-sass-modifiers/

Basic style file structure:

```
.button {
	width: 100px;

	&.-rounded {
		border-radius: 5px;
	}

	&.-big {
		font-size: 72px;
	}
}
```

and its usage:

```
<button class="button -rounded -big">Click me!</button>
```

Main idea behind is that you have all your "modifiers" followed by main class and they all **must** have dash prefix. Only exception for that is global modifiers wich may be used without dashed in front of them.

If there is need to have multiple components they should have following order: `component1 -mod1 component2 -mod2`

```
.component1 {
	&.-mod1 {}
}

.component2 {
	&.-mod2 {}
}
```

Important part here is that if you need to change something in `-mod2` you know where to find it - it should live inside component2 not inside component1


# Packages

## ES6

* babel-core
* babel-loader
* babel-preset-es2015
* babel-register

## Tests

* mocha
* nyc
* jsdom
* jsdom-global
* jquery-mockjax
* ignore-styles

## WebPack

* webpack
* webpack-dev-server

### Commons

* extract-text-webpack-plugin

### Templates

* html-loader

### Styles

* autoprefixer
* node-sass
* postcss-loader
* sass-loader
* style-loader
* css-loader

### Lint

* lint-staged
* babel-eslint
* eslint
* eslint-plugin-import
* stylelint
* stylelint-config-standard


# WebStorm configure tests runner

Extra Mocha options: `--require babel-register --require ignore-styles --require jsdom-global/register`

File patterns \ Test file patterns: `src/**/*.spec.js`
