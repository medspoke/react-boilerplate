## Release 1.6.0 - 2016-12-28

This is the provider core credentials release. As of now, providers can manage their core credentials through the web
 client.

**New Features**
- Provider Core Credentials UI
  - providers can now manage their core credentials information from the web client
- Provide a list of date formats to choose from when adding a date field in the form template editor.
  We are defaulting to a list of 4 formats: `MM/DD/YYYY`, `MM/YYYY`, `MM-DD-YYYY`, `MM-YYYY`, `YYYY`
     
**Changes**
- Update admin provider documents listing to allow updating document names in place.
  Additionally, update component structure to use core actions from @medspoke/core-actions as opposed to the ones 
  defined at the module level.
- Update admin provider credentials specialties form to load specialties asynchronously.
  Additionally, only display the specialty class and specialization in the select while still allowing search by code, group, class and specialization.
  
**Fixes**
- Disable max-height and overflow styles on the .credentials-section container styles.
  These were causing a double scrollbar issue on some screens.  
   
**Misc**
- Add @medspoke/provider-vault common module.
  Includes all components needed to render the core credentials UI for a provider. It also includes hooks to update the various fields and collections.
- Add @medspoke/core-api common module.
  This is where we define all the API request operations commonly used by the react clients.
  Additionally, this module could be used by a react-native app.
- Add @medspoke/core-actions common module.
  This is where we define all the common actions and reducers for the various react clients.
- Add @medspoke/core-ui common module.
  This is where all common UI components and helpers used by all the react client are defined.
- Add `DrawingPad` component to `@medspoke/core-ui`
  Canvas based, used to support signature and initials drawing.
- Bump @blueprintjs/core to 1.4.0
- Remove `react-signature-pad` from project dependencies.  
- Add auto lint:fix command. Just auto fixes based on linting rules.
- moved stories to name.story.js convention, now all stories are loaded dynamically when using the .story.js extension
- Updated webpack configs to use CSS modules
- Remove deprecated lists of specialties. These are now loaded asynchronously from the API.
- Moved styles folder into src
  This allows styles to be referenced from css modules
- Add LoadingOverlay component which renders an overlay with a loader inline or over the whole screen.
  Re-structure LoadingSpinner files to be more consistent with the rest of the project.  
- Improve `Utils.registerEvent` helper in `@medspoke/core-actions`
  It now requires the dispatch function as an argument and automatically dispatches the event.
  This allows for the inclusion of a `Utils.registerEvents` helper which takes an array of events and dispatches them one by one.
- Updated webpack config to resolve jsx files
- Add react-sticky package as a dependency.
  This is a lightweight package which makes 'sticky' elements easy to implement.
- moving to stage-1 as workaround for bug on CCI * Circle-ci has an invalid stage-2 for some reason  
     
## Release 1.5.1 - 2016-12-12

Fix issue where the phone number was passed with `-` to the API, resulting in a validation error.

## Release 1.5.0 - 2016-12-06

**New Features**
- Allow upgrading to a yearly paid plan if the provider is during a free trial.
  
  Currently, we only allow upgrading to a yearly paid plan from a free trial.
  - No downgrading or switching to a monthly plan is possible.
  - Once subscribed, payment information can be changed. 

- Implement sign out functionality.
  Redirect to `provider/account/subscription` page after sign-in. This is temporary, until we finish the rest of the sections in the provider client.
  
**Changes**
- Hide provider main nav sections and account profile section.
  We don't want to display these in production until the functionality behind them is fully implemented and tested.

- Hide forgot password and sign-up links from the sign-in screen.
  This is temporary, since we don't want to expose registratration through the web app yet, and password reset functionality is not wired up yet.

**Fixes**
- Fix issue where content was displaying above nav when scrolling.
- Display the current user's email address in the nav account sub-menu.

**Misc**
- Implement credentials story components for all the vault sections.

- Define local module at `@medspoke/provider-vault` under `common_modules/medspoke-provider-vault`.
  This represents a first step in the achieving a clear module and dependency separation between the provider and the admin clients.
  The `@medspoke/provider-vault` module includes all the components related to the provider core credentials section in the provider web client.

- Add `@medspoke/core-ui` module along with the `LoadingSpinner` component.
  This module will hold the various UI components shared between all react clients.

- Add `@medspoke/core-utils` common module.
  This is where common utility helpers used by all medspoke react clients are defined.
 
- Fix CI issues due to caching the node_modules directory.
  Since we are using `npm link` to reference local modules from common_modules to modules under node_modules, these links end up referencing non-existent directories during CI because of caching.
  CircleCI will cache node_modules but it will not cache common_modules, thus the issue explained occurs.
  
  To avoid this, we ensure that during CI, before running npm install, we remove all the files under node_modules/@medspoke
  
- Hook provider core credentials overview section to the API.

- Dynamically load the stripe publishable key from the API when loading Stripe.

- Detect which yearly plan to use since the live/test plan ids are not the same.


## Release 1.4.0 - 2016-12-01

**New Features**
- Admin: Add State Controlled Substance Certificate to the list of vault certificates.
- Admin: Add disclosure questions and answers section to admin provider credentials.
- Admin: Add practice locations section to admin provider core credentials.
- Admin: Allow admins to lock/unlock provider accounts.

    Admins can lock providers to restrict their access to the MedSpoke service.

- Provider: Expose provider account profile section. 

    Here, providers can update their profile details such as their profile picture or phone number.
    
    Profile picture upload is pending implementation. This section is planned to be extended in the future.
    
- Provider: Expose provider account credentials section.
     
     Here, providers can update their account credentials such as their password or email.
     
- Provider: Expose provider account payment & plan section.
     
     Here, providers can add payment information and choose/switch their MedSpoke plan.
     
     Choosing a plan is pending implementation. For now, all providers are considered to be on a free trial.
     
     Next steps: 
        - figure out the details around what plans MedSpoke will provide
        - figure out what to do with existing customers: grace period for them to choose a plan or block their access
         requesting that they add payment info and choose a plan.
         
**Changes**
- Strip down admin provider documents functionality to its basics.
    
    Setting the stage for a bigger overhaul around the admin provider documents section.
    
- Correctly format dates displayed in the various admin provider credentials sections.
    
    Dates are now displayed in `MM/DD/YYYY` format.
    
- Add phone number mask to admin provider overview phone number field.
- Admin: Split the provider listing page into 2 tabs: active & locked. 
    
**Fixes**
- Fix persistence issues with metadata related vault attributes.

    This fixes issues where flags such 'Use correspondence address as home address' or 'US citizenship' where no 
    longer being saved
 
- Fix issue where dates would not be persisted sometimes using the LiveDateField component.

    This was caused by the fact that dates were sent in `MM/DD/YYYY` format to the API, whereas the API expected `DD/MM/YYYY`. 
    This resulted in dates with the day higher than 12 to not persist (since the backend was reading a date with the month higher than 12).
    
    Dates are now sent in Time#iso8601 format to avoid any ambiguity.

**Misc** 
- Add generic Loading Spinner component.
    
    Usable wherever we have a pending loading state.
 
- Add complex provider form data factory for form interview stories.
- Add typography and tabs blueprint scss overrides.
- Add bourbon to the project dependencies. 
- Add blueprint/core js helpers and components.
    
    Read more at http://blueprintjs.com/docs

- Install jwt-decode to decode JWT auth tokens in the provider client.
- Add toaster component using the blueprint toaster.

    By default this is rendering notifications on the top right corner of the screen
    
- Disable outline on blueprint related elements, except when focusing with tabs. 
   
   Read more at: http://blueprintjs.com/docs/#a11y.focus

- Add `LiveEditableTextField` component using EditableText blueprint component.

    Useful when we want to have plain text editable and send a make a request to the API when the value is changed.

- Add helper to extract the provider id from the provider auth token in local storage.

    Useful when making requests within the provider module, since we don't have access to the provider id in the URL here.

- Fix issues with DOM setup when running mocha tests.
    
    The window object was not being set up properly, resulting in tests failing with a `Referrence error` to the `window` object.

    Additionally, since we are manually setting up the global context, we are also initializing the `PDFJS` object to avoid a `Referrence error` on it.

- Add `credit-card-type` npm package as a project dependency.

    More details at: https://github.com/braintree/credit-card-type


## Release 1.3.0 - 2016-11-22

**New Features**
- Add async select field component to be used when we need to fetch data remotely in a select.
- Implement admin form template assignment functionality. Admins can now assign a form template to a provider which 
generates a provider form. 

    A form template can be assigned multiple times, each time generating a new form template 
with the cloned and populated form data. 

    Form data population is done by mapping vault data to the vault keyed form fields.
- Implement admin provider form interview functionality. Admins can now fill in provider forms with information.
- Implement admin provider form PDF generation functionality. Admins can now generate PDFs from provider forms.  
- Add eslint and javascript & react configuration. This will help in keeping a consistent code style guide and 
prevent common bugs or issues during development.
- Add vault completion percentage to the admin provider listing. Completion is calculated based on the number of 
required fields and collections in the vault vs the number of required fields and collections which are filled in.

**Changes**
- Expose specialty in admin post graduate degrees form and listing.
- Removed redux devtools. This was not used at all and posed a security issue in production.
- Re-structured admin provider view sections to accommodate for core credentials, forms, documents and more in the 
future.
- Remove checkbox and radio form field types for boolean field types in the form template section editor. 

    We currently don't have any scenarios were these would be needed. If we end up needing these, we will add them back.
- Remove TSCA generate button from admin provider overview. This is no longer needed, the TSCA will be generated from
 the forms section in the admin provider view.

**Fixes**
- Fix issue where yes/no field display in admin vault current_active_duty was not displaying its value correctly
- Fix issue where the form template mapper shapes could end up with a negative height or width. These now have a 
minimums width and height.
- Fix issue where option shapes were rendered outside the canvas.
- Fix data loading sync issues when loading some components.

### Patch 1.2.4 - 2016-10-07

- add sorting algorithm and action for sorting work_histories according to biz req's
- Extend field options section in form template admin section editor to allow for non-vault attributes mapping.
- Fix issue where global css for .dropdown-menu was overriding selectize dropdown styles.
- Hook up credentialing entity creation form.
- Add workplaces listing admin section.
- Properly display the last 4 digits of the phone number when requesting a device verification code.
- Fix state collision issues due to generic naming.
- Hook new auth screens and remove the previous ones.
- add module support for credentialing_entities
- add story for creating a new credentialing entity

### Patch 1.2.3 - 2016-09-29

- add IDs to provider listing and add filtering on ID attribute

### Patch 1.2.1 - 2016-09-28

- Fix issue where, when generating options wrapper we were not grouping shapes based on an unique identifier, resulting in wrappers being generated incorrectly.

## Release 1.2.0 - 2016-09-26

Features / Enhancements:
- Add special mapping fields: - signature, initials and current_date can now be added to the form template editor and mapped to the pdf. 
- Expose email and phone number input fields in admin provider management.
- Add Beta Codes admin management section
- Add ruby script to easily update changelog when pushing releases/patches.

Fixes:
- Fix issue where the top level vault file keys where generated to `undefined/key`, resulting in files stored under the `undefined` directory in S3.

### Patch 1.1.1 - 2016-09-22

Features:
- Allow uploading pdf files in the vault (as opposed to just images). 
  - medspoke/medspoke-tracker#193

Fixes:
- Fix issue where the vault data was injected with an `undefined` key unintentionally.
  - medspoke/medspoke-tracker#196
- Fix medicare/medicaid participating flag display issue.

## Release 1.1.0

Multiple fixes and updates in the admin section. We can now:
- fill in vault information for providers
- create form templates
- map form templates
- generate forms for providers

### Patch 1.0.1

Fix issues with webpack production config causing deployments to fail.
Fix issues with displaying document form when no document is selected

## Release 0.1.0

First production release of the react frontend app.









