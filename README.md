# configure-local

- TypeScript 2.0 targeting es6
- Node.js 6

## Summary
This module wraps [**nconf**](https://github.com/indexzero/nconf), and provides a fixed policy of:  
- Use project local configuration files, in the ./config directory, to configure a node instance.
- The configuration files match the name of the instance environment specified by the NODE_ENV environment variable.
- Shared configuration is in common.json.
- The precedence of the configuration sources is:
  - command line arguments  
  Configuration settings passed on the command line override any other settings.
  - environment variables  
  Configuration settings set in environment variables override any settings in configuration files.
  - the instance environment specific configuration file  
  Configuration settings set in an environment specific configuration file override any settings in the common configuration file.
  - the common configuration file  
  Configuration settings in the common configuration file are used when none of the other sources specify a setting.

## Examples
See the [tests](./configure-local.tests.ts)

## Usage

Assuming that you have three instance environments: *development*, *qa*, and *production*
You would then have these files:
- ./config/common.json  
- ./config/development.json
- ./config/production.json
- ./config/qa.json


To configure a module:
```
configure = require('@sabbatical/configure-local')
```
The configuration is loaded the first time *configure-local* is *require*'d.


To get the values of configuration parameters, use get() as in [**nconf**](https://github.com/indexzero/nconf):
```
configure.get()   // returns the entire configuration
configure.get('a:b')  // returns the value or object at that would be accessed by ['a']['b']
```

To reload the configuration:
```
configure.reloadConfig()
```
Subsequent calls to configure.get will return updated values.

## Setup for Build
```
npm install
```

## Build
Build the software:  
```
npm run build
```

Remove the generated files:
```
npm run clean
```

## Test
Run the tests:  
```
npm run test
```

## Problems?
Please report them as issues on the [GitHub repo](https://github.com/psnider/configure-local).
