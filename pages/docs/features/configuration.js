// Packages
import markdown from 'markdown-in-js'

// Components
import Now from '../../../components/now/now'
import { P } from '../../../components/text/paragraph'
import { Code, InlineCode } from '../../../components/text/code'

// Utilities
import withDoc, { components } from '../../../lib/with-doc'
import { rauchg, leo } from '../../../lib/data/team'

// prettier-ignore
export default withDoc({
  title: 'Configuring Now',
  description: 'Configuring Now so that your deployments are exactly as you need them',
  date: '22 Feb 2017',
  authors: [rauchg, leo],
  editUrl: 'pages/docs/features/configuration.js',
})(markdown(components)`

This guide explains how to use these methods to configure and customize the default behavior of Now CLI and Now Desktop.

In addition to the options available in the command line interface (like \`--name\` for setting the name of the deployment), we also support saving certain parameters into a config file of your choice.

The types of configuration files can be devided into two groups:

## Local Configuration

This describes the set of configuration rules that are applied per project. The configuration
file always lives in the root directory of the project (except when a custom path is
specified using the ${<InlineCode>--local-config</InlineCode>} flag in Now CLI).

You can choose between creating a separate file for configuring Now (named ${<InlineCode>now.json</InlineCode>}) or
using the ${<InlineCode>package.json</InlineCode>} file for this (if it's a Node.js project). Please note that
it's **not possible to use both methods to configure Now** for a given project. If you use ${<InlineCode>now.json</InlineCode>}, you can't include the \`now\` namespace within package.json, and viceversa.

### package.json

If you have a JavaScript-based project (like a Node.js server or a frontend with a \`build\` script), you are already using \`package.json\`.

As a convenience, we allow for settings to be defined within the \`now\` namespace inside the file. For example, let's say you wanted to always alias a deployment to \`cool.now.sh\` upon deployment. Your \`package.json\` would look as follows:

${
  <Code>
    {`{
  "name": "my-node-project",
  "dependencies": {
    "micro": "latest"
  },`}<P.B>
        {`
  "now": {
    "alias": "cool"
  },`}
      </P.B>{`
  "scripts": {
    "start": "micro"
  }
}`}
  </Code>
}

For a list of all available options, refer to the "Settings" section below.

### now.json

For every type of deployment, including \`package.json\` ones, you can create a \`now.json\` file that contains your deployment's configuration.

For example, consider a static deployment with some \`.html\` files in a directory called \`my-website\`.

Since no configuration is supplied, the deployment's name is obtained from the directory. To customize this, you can create a \`now.json\` file inside it as follows:

${
  <Code>
    {`{
  "name": "my-new-name"
}`}
  </Code>
}

For a list of all available options, refer to the "Settings" section below.

### Settings

All of the properties mentioned below can be used both in the \`package.json\` and inside the \`now.json\` file:

#### \`name\` (string)

The prefix for all new deployment instances. The CLI usually generates this field automatically based on the name of the directory. But if you'd like to define it explicitly, this is the way to go.

${<Code>{`"name": "zeit-chat"`}</Code>}

#### \`alias\` (string|array)

Aliases which will be assigned to the latest deployment when running \`now alias\` (with no arguments).

${
  <Code>
    {`"alias": "zeit.chat"

"alias": [
  "zeit.chat"
]`}
  </Code>
}

#### \`env\` (object|array)

A list of environment variables to be set on each new deployment instance.

${
  <Code>
    {`"env": {
  "DATABASE_NAME": "test"
}`}
  </Code>
}

If an array is used, the user will be prompted for the value of each environment flag
when deploying the project:

${
  <Code>
    {`"env": [
  "DATABASE_NAME"
]`}
  </Code>
}

#### \`scale\` (object)

Set [scaling](/docs/features/scaling) rules for your deployment.

As an
example, the following configuration will ensure it is scaled
to **at least 1 instance and 5 instances at maxium** in
our [SFO1](https://sfo.now.sh) datacenter:

${
  <Code>
    {`"scale": {
  "sfo1": {
    "min": 1,
    "max": 5
  }
}`}</Code>}

You can also instruct Now to automatically
pick the maximum number of instances.

The following will instruct your deployment
to scale **between 1 and 10 instances** within
the [BRU1](https://bru.now.sh) datacenter:

${
  <Code>
    {`"scale": {
  "bru1": {
    "min": 1,
    "max": "auto"
  }
}`}</Code>}

If you want to learn about different way of scaling your
deployment to multiple regions and datacenters, read
the [feature guide](/docs/features/scaling).

#### \`dotenv\` (boolean|string)

Read environment variables from [dotenv](https://github.com/motdotla/dotenv) file.

${
  <Code>
    {`"dotenv": true

"dotenv": ".env.production"`}
  </Code>
}

#### \`files\` (array)

A list of files and directories to be force-uploaded to the deployment (even if they're ignored by \`.gitignore\`).

${
  <Code>
    {`"files": [
  "hello.png",
  "dist"
]`}
  </Code>
}

Note that this will act as a whitelist of files and folders to upload. Any file or folder not added there will not be uploaded to the deployment.

#### \`type\` (string)

A field for specifying the deployment type ("npm", "docker" or "static") if both \`package.json\` and \`Dockerfile\` exist. This will prevent \`now\` from asking you to choose the type in these cases.

${<Code>{`"type": "npm"`}</Code>}

#### \`forwardNpm\` (boolean)

Automatically forward the npm login information to our servers to install [private npm packages](https://www.npmjs.com/features).

${<Code>{`"forwardNpm": true`}</Code>}

#### \`public\` (boolean)

Controls if \`_src\` should be available or not. By default, this property is set to \`true\` if your account is using the OSS plan and \`false\` if the Premium plan is in use.

${<Code>{`"public": true`}</Code>}

#### \`engines\` (object)

In general, we recommend letting us choose the version, because it ensures that you always take advantage of the latest features, performance improvements and bug fixes.

By default, all new deployments will come with the [latest stable version](https://nodejs.org/en/download/current/) of Node.js

If you need a specific Node.js version we allow you to define the version (semver syntax) of [Node.js](https://nodejs.org/en/) you want to run on the server:

For an example, this is how to use the latest version of Node.js 6 inside ${<Now color="#000" />}.

${
  <Code>
    {`"engines": {
  "node": "^6.0.0"
}`}
  </Code>
}

#### \`api\` (string)

The URL of the Now API which Now CLI and Now Desktop should interact with.

By default, it's pointing to \`https://api.zeit.co\`, which always points to
the right location depending on where you're connecting from (Anycast).

This property takes precedence over ${<InlineCode>sh.api</InlineCode>} in ${<InlineCode>config.json</InlineCode>}.

## Global Configuration

This describes the set of configuration rules that apply to all projects
and all clients of Now (Now CLI, Now Desktop, etc).

By default, they live in a directory named ${<InlineCode>.now</InlineCode>} in your
home directory. Within it, you can find two files (which you
can learn more about below). If you need to specifiy a different location of the directory, you can use
the ${<InlineCode>--global-config</InlineCode>} flag in Now CLI, which takes in a
custom path to a directory containing the two files.

### config.json

This file can be (if needed) modified manually. It doesn't contain any authentication
information, but rather only cached account data and configuration rules that
can apply to all Now clients (Now CLI and Now Desktop).

#### \`updateChannel\` (string)

For our software, we provide two update channels ("stable" and "canary"). This property
lets you pick either one in order to enjoy a different pace of updates.

Read more [here](/blog/canary) about why these channels exist and what
they're being used for. As an example, this will make Now Desktop and Now CLI receive
canary updates:

${<Code>{`"updateChannel": "canary"`}</Code>}

#### \`sh.api\` (string)

The URL of the Now API which Now CLI and Now Desktop should interact with.

By default, it's pointing to \`https://api.zeit.co\`, which always points to
the right location depending on where you're connecting from (Anycast).

**Important**: As indicated by the \`sh.\` prefix, this configuration
property needs to be set under the \`sh\` provider scope inside the global config file.

#### \`desktop.updateCLI\` (boolean)

This option defines whether or not Now Desktop should automatically update the
Now CLI instance on your device or not.

By default (if the property is not set or set to \`true\`), auto-updates
are enabled. In turn, if it's set it to \`false\`, you won't receive any updates
for Now CLI automatically. In that case, you'll have to update manually.

#### \`desktop.teamOrder\` (array)

At the bottom of Now Desktop's event feed, you can find a list of teams that
you're a member of.

When re-arranging them by holding \`CMD\` and dragging
them into a different location using your cursor, the config property will
be updated to contain the new order.

If you want, you can modify the order of this list manually.

### auth.json

This file should not be touched manually. It contains the authentication information
for all of your providers accessed through a Now client.

In the case that you're uploading your global configurion setup to a potentially
unsecure destination, we highly recommend ensuring that this file won't be uploaded,
as it allows an attacker to gain access to your provider accounts.
`)
