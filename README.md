# **Swiftserver**

Minimalistic development server for all your frontend needs.


                                                           npm i swiftserver
                                                           

- create `server.js` file in your project root directory.
- put in `require('swiftserver')(options);`
- run `node server`
  _This will run a development server with default settings on http://localhost:3000_

## Complete options:

**PORT** : _Number_ (optional) = The port which the server should listen to. Defaults to `3000`

**fileName** : _String_ (optional) = Name of the `.html` file you want ot serve. Defaults to `index.html`

**public** : _String_ (optional) = Name of the directory in which your static assets are kept. Defaults to the root directory of your project.

**secure** : _Boolean_ (optional) = Set to `true` if you want to enable HTTPS. Defaults to `false`.

**NOTE : Even though secure is true, your browser will still show insecure which is fine.
The site will be running on https nevertheless.**

## **Usage example:**

##### Assuming I have the following project structure:

:file_folder: **public**

- :file_folder: images
  - logo.png
- :file_folder: css
  - main.css

**:clipboard: home.html**



To serve `home.html` using swiftserver(with https):

                      //server.js
                       const options = {
                        PORT : 4000,
                        fileName : "home.html",
                        public : "public",
                        secure : true
                        }

## Works with ReactJs too

In the `'public'` option, put in the `'build'` directory, after you run `npm run build`.
