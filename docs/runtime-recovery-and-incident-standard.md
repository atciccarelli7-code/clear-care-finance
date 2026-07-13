# CAF runtime recovery and incident standard

Community Acquired Finance must fail safely. A visitor should not be left with a blank page, exposed exception text, or an ambiguous action when a client-side failure occurs.

This standard complements build, unit, prerender, deployment-smoke, runtime-log, and future browser-journey verification. It does not replace any of them.

## Covered failure classes

### Stale lazy-chunk or dynamic-import failure

This can occur when a visitor keeps an older application tab open while a new deployment replaces hashed JavaScript assets.

Recognized failure signatures receive one automatic reload for the same normalized route and deployed entry asset. The attempt is recorded in session storage using hashed route and build identifiers. Query strings, fragments, form answers, local-storage contents, and exception text are not stored in the marker.

If the same route/build pair fails again, automatic recovery stops and the visitor receives the recovery screen.

### Other React render failure

Other render failures do not trigger an automatic reload. The visitor receives the recovery screen immediately.

## Recovery screen requirements

The application-wide fallback must:

- replace a failed application render rather than leave a blank document;
- expose an assertive alert and one clear H1;
- explain the problem in plain language;
- provide a Reload action;
- provide a direct Start Here escape route;
- warn that unsaved in-progress answers may need to be entered again;
- remain keyboard accessible and visibly focusable;
- avoid loading a second application, router, analytics system, or support widget.

The screen must not render:

- the exception message;
- stack traces;
- component names from the failure trace;
- user-entered answers or financial values;
- employer, plan, provider, insurer, medication, diagnosis, account, claim, or member information;
- local-storage contents;
- query strings or URL fragments.

## Telemetry boundary

This recovery release adds no new error-reporting vendor and transmits no error payload.

A future error-observability system may be considered only if it can enforce all of the following before activation:

- fixed error categories rather than raw messages where practical;
- route groups rather than full URLs;
- query and fragment removal;
- no form answers, local-storage values, or DOM snapshots;
- documented retention and access controls;
- consent and policy review where applicable;
- tests proving sensitive values are rejected.

## Release verification

Every change to the boundary or recovery rules requires:

- deterministic failure-classification tests;
- bounded-reload tests;
- rendered fallback tests;
- proof that exception details are absent from the public UI;
- blocking lint and unit tests;
- production build, bundle budget, prerender, route, and search-readiness checks;
- exact-head Vercel preview review;
- build-log and runtime-error review.

## Incident handling

When a production client failure is reported:

1. Confirm the exact route, approximate time, device/browser, and whether reload recovered the page. Do not request sensitive form contents.
2. Inspect Vercel runtime errors and the exact deployment.
3. Check the latest GitHub checks and deployed-site smoke artifact.
4. Reproduce on the canonical route and, when available, the exact deployment preview.
5. Classify the issue as deployment/chunk, hydration, route, component, browser compatibility, third-party script, or unknown.
6. Fix the underlying defect; do not weaken the recovery screen or suppress a failing quality gate.
7. Verify the exact fix through CI, preview, browser checks where available, and production smoke tests.
8. Record whether the problem was implemented, reproduced, fixed, deployed, and observed as resolved. Keep those states distinct.

## Next reliability layers

The recovery boundary is one layer in the CAF quality system. The next staged upgrades are:

1. browser-level certification of flagship journeys at mobile and desktop widths;
2. automated accessibility scanning plus keyboard and focus assertions;
3. field and synthetic performance service-level objectives by route group;
4. independent calculator golden cases and effective-year regression fixtures;
5. official-source drift, broken-link, and review-date monitoring;
6. production analytics delivery verification;
7. newsletter contact and delivery verification;
8. privacy-safe controlled beta feedback;
9. staged rollback and incident ownership for larger traffic levels.

New product surface should not outrank these systems unless it fixes a critical user problem or is supported by real acquisition, activation, retention, or buyer evidence.
