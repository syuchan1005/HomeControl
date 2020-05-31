# HomeControl
## google setting
1. Access [Google Actions Console](https://console.actions.google.com/)
2. Click `New Project`
3. Fill fields and click `Create project`
4. Click `Smart Home`
5. Setup `Quick setup -> Name your Smart Home action`
6. Fill `config.template.yaml`
   > RedirectURL: https://oauth-redirect.googleusercontent.com/r/<Project ID>
   > (Project ID can be found in the project settings)
7. Move `config.template.yaml` to `config.yaml`
8. Setup `Quick setup -> Setup account linking`
   ```
   Linking type: OAuth, Authorization code
   OAuth client:
     clientId: <from config.yaml>
     secret: <from config.yaml>
     authorization url: https://<SERVER_HOST>/google_auth
     token url: https://<SERVER_HOST>/oauth/token
     scope: <NONE>
   Testing instructions:
     Sign up and register your device.
   ```
9. Setup `Build your Action -> Add Action(s)`
   ```
   Fulfillment URL: https://<SERVER_HOST>/google_actions
   ```
10. Open `Google Home` app in your phone
11. Open `Settings -> Works with Google`
12. Click `[test] <YOUR SMART HOME ACTION NAME>`
 
