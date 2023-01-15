# Sanity Check

> Module to make adding sanity checks easy in Node projects. Supports Slack Webhook, Discord Webhook and Express server alerts.

## Prerequisites

To install this module you can just use

```sh
$ npm i node-sanity-check
```

## Example

Below you can find example how to use this module to add simple sanity check if memory usage is exceeding 100 MB.

```js
const { StartSanityChecks, AddSanityCheck, AddAlert } = require("./");

StartSanityChecks();

AddSanityCheck("memory", () => {
  const formatMemoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100}`;

  const memoryUsage = process.memoryUsage();

  // Check if memory usage is over 100MB
  if (parseFloat(formatMemoryUsage(memoryUsage.heapUsed)) > 100) {
    return [
      false,
      `Exceeded memory limit. Current usage: ${formatMemoryUsage(
        memoryUsage.heapUsed
      )}MB`,
    ];
  }

  return [true, null];
});

AddAlert(
  `Test`,
  "https://canary.discord.com/api/webhooks/DISCORD_WH_ID/DISCORD_WH_TOKEN"
);

console.log("Hello world", process.__sanity);
```

### Environment Variables

- SANITY_CHECK_LOGGING - Enables logging of the module in console if set to 'true' - Default: `false`
- SANITY_CHECK_EXPRESS - Starts Express server which you can use to programmatically check sanity of your application, if set to 'true' - Default: `false`
- SANITY_CHECK_EXPRESS_PORT - Port express will be ran on - Default: `25022`
- SANITY_CHECK_EXPRESS_HOST - Host express will bind to - Default `0.0.0.0`
- SANITY_CHECK_EXPRESS_AUTHORIZATION - String that will be passed in 'x-authentication' header to authorize access - No default (Authentication disabled)

## Authors

- **Elmedin Turkes** - [ElmTheDev](https://github.com/ElmTheDev)

PRs are welcome!

## License

MIT License

Copyright (c) 2023 Elmedin Turkeš

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
