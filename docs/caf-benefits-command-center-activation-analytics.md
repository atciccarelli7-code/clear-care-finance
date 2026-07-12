# Benefits Command Center Activation Analytics

## Objective

Measure whether visitors understand and activate the Benefits Command Center without transmitting financial, benefits, employer, health-plan, or free-text data.

All events use the existing consent-gated `trackSiteEvent` utility. No event is sent without analytics consent.

## Activation events

- `benefits_command_center_view`
- `benefits_command_center_start_own`
- `benefits_command_center_sample_open`
- `benefits_command_center_sample_comparison_open`
- `benefits_command_center_tour_start`
- `benefits_command_center_tour_complete`
- `benefits_command_center_tour_skip`

Existing workspace events continue to measure package creation, health-plan addition, Receipt copy/print, and My Plan actions.

## Allowed activation properties

The activation property builder permits only fixed categorical values:

- `event_category`
- `tool_id`
- `entry_surface`
- `activation_path`
- `module_id`
- `package_count`
- `completion_band`

### Fixed values

`entry_surface`:

- `command_center`
- `homepage`
- `start_here`
- `tools`
- `healthcare_workers`
- `insurance`
- `open_enrollment`
- `related_tool`
- `unknown`

`activation_path`:

- `start_own`
- `sample_receipt`
- `sample_comparison`

`module_id`:

- `activation`
- `tour`
- `receipt`
- `comparison`
- `workspace`

`completion_band`:

- `0_25`
- `26_50`
- `51_75`
- `76_100`

## Prohibited data

Events must never include:

- package labels
- employer names
- insurer names
- salary or hourly rate
- overtime or bonus amounts
- premiums
- deductibles
- out-of-pocket maximums
- employer contributions
- package totals
- benefit values
- commute values
- health-plan inputs
- verification-question text
- notes or comments
- any other free text

The global analytics sanitizer now rejects keys associated with free text, notes, and comments in addition to the existing financial, medical, employer, compensation, and benefits patterns.

## Funnel interpretation

The intended activation funnel is:

1. Command Center view
2. Start-own, sample Receipt, or sample comparison selection
3. Full workspace opened
4. Package created or edited
5. Receipt viewed, copied, or printed
6. Comparison viewed
7. Fixed action added to My Plan

Sample activity should be analyzed separately from user-created package activity. Sample values themselves are never transmitted.

## Testing

Automated tests verify:

- the activation property builder emits only allowlisted categories
- sensitive financial and employer keys are removed by the shared sanitizer
- free-text keys are removed
- sample and user-created pathways can be distinguished with fixed categorical fields
- sample data does not contain real employer or insurer identities
