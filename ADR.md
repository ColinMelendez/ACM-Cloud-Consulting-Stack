<!-- markdownlint-disable -->
# Architecture Decision Records

## Implementing a backend service

#### In the context of

Users Submitting contact information on the website

#### Facing

The need to securely validate submissions, identify duplicate submissions, and
prevent abuse of the submission system.

#### We decided to

Implement a backend service which will process submissions from the web app client
before they are sent to the storage layer. The service will be hosted on the
CloudFlare workers platform.

#### to achieve

Secure execution of business logic to process user submissions, flexibility
to add features in the future based on this groundwork, a (probably) zero-cost
hosting platform with good response times, and easy integration with the hosting
provider that is already being used for the website (Cloudflare).

#### accepting the downsides of

Needing to host the backend service somewhere, which comes with cost-based limitations
for keeping the service operational, and bottlenecks the uptime of the contact-info
submission feature by the uptime of the backend service (trivial concern).

#### Notes & Discussion

The contact-submission page really does need a backend. Having the file storage destination
publicly exposed in the client app alone gives you essentially nothing to work with when it
comes to filtering the submissions. While our use-case is somewhat low-stakes, it would be
very sloppy to expose such a vulnerability.

The cost concern is minor - the usage scale of this application is such that the free tier
for hosting the backend should never come into play from normal use. In the case of
abuse/DDOS, cloudflare should ideally prevent it, and otherwise limits can be set to ensure
that costs are not incurred.

## Using Hono for the API

#### In the context of

Users submitting contact information on the website

#### Notes and Discussion

Hono is a new favorite of mine for building simple typescript APIs. It has good dx with
it's straightforward composability of routes and middleware. It is very performant; based
on all benchmarks and discussions that I have been exposed to, Hono is the most performant
typescript API framework *that runs in any JS execution environment*\*. Hono also has good
support for generating openAPI Swagger docs, and some nice explicit integrations with
cloudflare features, which might be a bonus in the future.

The OpenAPI integration and deployment flexibility are not immediate concerns, but they are
significant bonuses as the future deployment of this service may change considerably over
time.
