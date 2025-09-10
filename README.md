# Detour 🛣️

> [!NOTE]
> Detour is NOT a jailbreak. It simply loads WAFs. Stay tuned for UJ!

Detour is a mesquito-inspired, persistent, offline WAF loader that (theoretically) works on all kindles up to 5.18.4. 

It is based on an exploit discovered by hhhhhh.

Created by [penguins184](https://ko-fi.com/penguins186)

## Installation 

### All Kindles, <5.18.1

1. Turn on aeroplane mode.
2. Reboot.
3. Copy & paste the detour installer into kindle root. Replace if necessary.
4. Open store, enable wifi when prompted.
5. Detour changes the internal URL the store fetches.
6. Delete .active_content_sandbox (cache), reboot once complete.
7. Run the store again, profit!

### Mass Storage (Non-MTP) 5.18.1+

- Follow the above steps but make sure to use a `Detour-Fat.zip` which contains more files to slow deletion.

### MTP 5.18.1+

- Use KAT.

## Removal

- Open Detour, press the three dots, click "Uninstall".
- Delete `.active_content_sandbox` and `detour`.

## Development

- Developing for Detour is the same as developing for [Illusion](https://github.com/polish-penguin-dev/Penguins-Kindle-Wiki/blob/main/Illusion-Guide.md) with some additional steps.
- After making your Illusion app, to make it a detour app, all you need to do is bundle and add a link to [detour.js](https://github.com/KindleModding/Detour/blob/master/Detour/assets/detour.js).
- Then, you can place the WAF without the scriptlet into your `detour/apps` folder.
- Detour.js just fixes the top bar so you can navigate back to detour from your WAF.
