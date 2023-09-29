SQLite Viewer GUI Program written in Rust using Tauri + NextJS

[ TODO LIST ]

- [ ] Make a web version ( if possible )
- [ ] Add Linux and MacOS Builds
- [ ] Handle Sqlite with password
- [ ] Render performance for big sqlite files
- [x] Execute SQL command tab
- [x] Schema Generator
- [ ] Sort by column
- [x] Add themes

##

### Features

**1- Browse All Your SQLite Tables.**

![photo](https://i.ibb.co/SBzVnFX/Browse.png)

**2- Database Structure View.**

![photo](https://i.ibb.co/8zGSBHN/Struct.png)

**3- Execute SQL Commands**

![photo](https://i.ibb.co/SnTXqwy/execute.png)

**4- Errors are easy to recognize**

![photo](https://i.ibb.co/Xtb0pZT/error.png)

**5- Light and Dark mode**

![photo](https://i.ibb.co/XpC9Mwm/image.png)

##

1. **Clone the Repository**

   ```sh
   git clone https://github.com/TeaByte/sqlite-viewer.git
   cd sqlite-viewer
   ```

2. **Install Dependencies**

   ```sh
   npm install
   cargo install tauri-cli
   ```

3. **Start Dev Server**

   ```sh
   cargo tauri dev
   ```

##
