# No Tap Mention

Tap a message author's name without inserting a mention or opening their profile.

## Install beta

Add this repository URL in **Valenced → Plugins → Advanced**:

```text
https://raw.githubusercontent.com/dariussbezy/No-Tap-Mention/main/index.json
```

Install **No Tap Mention**, select **beta**, enable it and restart Discord. Version: **1.0.1-beta**.

Disable **Tap to Profile** if installed: these plugins change the same action. Avatar taps and long presses are left unchanged.

This is an experimental test build. Compiled and tested with simulated handlers; Android and iOS behavior inside Discord still needs device verification. This build patches the native chat onTapUsername callback in MessagesRenderer. That callback path was confirmed by inspecting the Android Discord bundle; live device behavior and iOS still need verification.

No settings, stored data or network requests.
