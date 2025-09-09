# Detour 🛣️

> [!NOTE]
> Detour is NOT a jailbreak. It simply loads WAFs, and is backwards compatible with Mesquito. Stay tuned for UJ!

Detour is a mesquito/illusion-inspired persistent WAF loader that works on all non-MTP kindles up to 5.18.4. (MTP kindles before 5.18.1 are still supported).

It is based on an exploit discovered by hhhhhh.

Created by [penguins184](https://ko-fi.com/penguins186)

## Installation 

### All Kindles, <5.18.1

1. Turn on aeroplane mode.
2. Reboot.
3. Copy & paste the detour installer (.active_content_sandbox) into kindle root.
4. Open store, enable wifi when prompted.
5. Detour changes the internal URL the store fetches.
6. Delete .active_content_sandbox, reboot once complete.
7. Run the store again, profit!

### Mass Storage (Non-MTP) 5.18.1+

- Follow the above steps but make sure to use a `Detour-Fat.zip` which contains more files to slow deletion.

### MTP 5.18.1+

- Use KAT.

To ever update the loader if it has an update, delete .active_content_sandbox & reboot to force it to re-fetch.

## Removal

- Open Detour, press the three dots, click "Uninstall".