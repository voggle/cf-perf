# cf-perf

cf-perf is a Cloudflare Workers script that measures the latency of Workers KV APIs.

## Usage

* Sign up for a free or paid Cloudflare account
* Install wrangler
  * `npm install -g wrangler` or `yarn global add wrangler`
* Authenticate your Cloudflare account 
  * `wrangler login`
* Create at least one KV namespace
  * `wrangler kv:namespace create <YOUR_NAMESPACE>`
  * Note the hex-encoded id
* Check out this repository
  * `git checkout https://github.com/voggle/cf-perf`
* Replace the `id` field in `wrangler.toml` with your KV namespace id
* Run `wrangler deploy` to deploy the Workers script to `your-subdomain.workers.dev`
* Open the website in your browser
  * Change the following query parameters to customize the performance test. For example, `/?r=10&k=64&v=256` generates 10 random KV entries, each with a 64-byte key and a 256-byte payload.

## License

MIT
