<div id="top"></div>
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/angelina-tsuboi/duck-duck-boom/blob/main/media/logo.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">Duck Duck Boom</h3>

  <p align="center">
    A VS Code Extension to import USB Rubber Ducky payloads quickly!
    <br />
    <br />
  </p>
</div>

## About The Project
<div align="center">
<img src="https://github.com/angelina-tsuboi/duck-duck-boom/blob/main/media/preview.gif" alt="Preview" width="800" height="450">
</div>
<br />
Duck Duck Boom is a VS Code Extension to import USB Rubber Ducky keystroke injection payloads quickly! 

* Import payloads on Hak5 fast
* Easy payload development on devices such as the USB Rubber Ducky and the Rubber Nugget
* Select many payloads from 10 categories ranging from exfiltration to prank payloads

The extension contains a "Quick Payload Select" option that can be accessed through the command palette (Ctrl+Shift+P on Windows and Cmd+Shift+P on Mac).
Duck Duck Boom retrieves up-to-date payloads from the [usbrubberducky-payloads](https://github.com/hak5/usbrubberducky-payloads) repository from Hak5.

## The USB Rubber Ducky
The USB Rubber Ducky is a flash drive that can type keystroke injection payloads onto a device at seriously fast speeds! Computers detect the USB Rubber ducky as a normal keyboard leaving them vulnerable to keystroke injection attacks. Hak5 has a repository storing payloads for the USB Rubber Ducky submitted by users. Duck Duck Boom provides quick access to payloads stored on the Hak5 USB Rubber Ducky repository. 

### Payloads Information
Payloads for the USB Rubber Ducky are written with a language called Ducky Script. Payloads for the USB Rubber Ducky are sorted into 10 categories (credentials, execution, exfiltration, general, incident response, mobile, phishing, prank, recon, and remote_access). On Duck Duck Boom, the **Quick Select** command lets you view payloads under all of those categories.

## Project Structure
`src/extension.ts`: registers commands with VS Code and makes API calls to retrieve all payloads (WIP: API call to retrieve all payloads)

`src/controllers/quickPickController.ts`: contains Quick Select component functionality. Displays payload categories, and makes respective API calls

`src/controllers/payloadController.ts`: contains API functions to retrieve all payloads under the Hak5 USB Rubber Ducky repository

`src/components/treeDataProvider.ts`: contains code to open up a view panel and display all payloads under a TreeView provider (WIP)

`src/utils/payloadTypes.ts`: contains TypeScript types for API payload responses

## Upcoming Features
Currently, Duck Duck Boom is in beta mode which contains a Quick Select payload option. Future features of Duck Duck Boom include:

1. `src/extension.ts`: registers commands with VS Code and makes API calls to retrieve all payloads 

2. `src/components/treeDataProvider.ts`: contains code to open up a view panel and display all payloads under a TreeView provider 

If you would like to contribute to this repository, feel free to fork it and submit a pull request with the implemented features.
