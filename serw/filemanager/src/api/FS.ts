import * as fs from "fs";

interface File {
  size: number;
  filepath: string;
  originalFilename: string | null;
  newFilename: string;
  mimetype: string | null;
  mtime?: Date | null | undefined;
  hashAlgorithm: false | "sha1" | "md5" | "sha256";
  hash?: string | null;
  toString(): string;
}

const fileTypes = [
  "3g2",
  "3ga",
  "3gp",
  "7z",
  "aa",
  "aac",
  "ac",
  "accdb",
  "accdt",
  "ace",
  "adn",
  "ai",
  "aif",
  "aifc",
  "aiff",
  "ait",
  "amr",
  "ani",
  "apk",
  "app",
  "applescript",
  "asax",
  "asc",
  "ascx",
  "asf",
  "ash",
  "ashx",
  "asm",
  "asmx",
  "asp",
  "aspx",
  "asx",
  "au",
  "aup",
  "avi",
  "axd",
  "aze",
  "bak",
  "bash",
  "bat",
  "bin",
  "blank",
  "bmp",
  "bowerrc",
  "bpg",
  "browser",
  "bz2",
  "bzempty",
  "c",
  "cab",
  "cad",
  "caf",
  "cal",
  "cd",
  "cdda",
  "cer",
  "cfg",
  "cfm",
  "cfml",
  "cgi",
  "chm",
  "class",
  "cmd",
  "code-workspace",
  "codekit",
  "coffee",
  "coffeelintignore",
  "com",
  "compile",
  "conf",
  "config",
  "cpp",
  "cptx",
  "cr2",
  "crdownload",
  "crt",
  "crypt",
  "cs",
  "csh",
  "cson",
  "csproj",
  "css",
  "csv",
  "cue",
  "cur",
  "dart",
  "dat",
  "data",
  "db",
  "dbf",
  "deb",
  "dgn",
  "dist",
  "diz",
  "dll",
  "dmg",
  "dng",
  "doc",
  "docb",
  "docm",
  "docx",
  "dot",
  "dotm",
  "dotx",
  "download",
  "dpj",
  "ds_store",
  "dsn",
  "dtd",
  "dwg",
  "dxf",
  "editorconfig",
  "el",
  "elf",
  "eml",
  "enc",
  "eot",
  "eps",
  "epub",
  "eslintignore",
  "exe",
  "f4v",
  "fax",
  "fb2",
  "fla",
  "flac",
  "flv",
  "fnt",
  "folder",
  "fon",
  "gadget",
  "gdp",
  "gem",
  "gif",
  "gitattributes",
  "gitignore",
  "go",
  "gpg",
  "gpl",
  "gradle",
  "gz",
  "h",
  "handlebars",
  "hbs",
  "heic",
  "hlp",
  "hs",
  "hsl",
  "htm",
  "html",
  "ibooks",
  "icns",
  "ico",
  "ics",
  "idx",
  "iff",
  "ifo",
  "image",
  "img",
  "iml",
  "in",
  "inc",
  "indd",
  "inf",
  "info",
  "ini",
  "inv",
  "iso",
  "j2",
  "jar",
  "java",
  "jpe",
  "jpeg",
  "jpg",
  "js",
  "json",
  "jsp",
  "jsx",
  "key",
  "kf8",
  "kmk",
  "ksh",
  "kt",
  "kts",
  "kup",
  "less",
  "lex",
  "licx",
  "lisp",
  "lit",
  "lnk",
  "lock",
  "log",
  "lua",
  "m",
  "m2v",
  "m3u",
  "m3u8",
  "m4",
  "m4a",
  "m4r",
  "m4v",
  "map",
  "master",
  "mc",
  "md",
  "mdb",
  "mdf",
  "me",
  "mi",
  "mid",
  "midi",
  "mk",
  "mkv",
  "mm",
  "mng",
  "mo",
  "mobi",
  "mod",
  "mov",
  "mp2",
  "mp3",
  "mp4",
  "mpa",
  "mpd",
  "mpe",
  "mpeg",
  "mpg",
  "mpga",
  "mpp",
  "mpt",
  "msg",
  "msi",
  "msu",
  "nef",
  "nes",
  "nfo",
  "nix",
  "npmignore",
  "ocx",
  "odb",
  "ods",
  "odt",
  "ogg",
  "ogv",
  "ost",
  "otf",
  "ott",
  "ova",
  "ovf",
  "p12",
  "p7b",
  "pages",
  "part",
  "pcd",
  "pdb",
  "pdf",
  "pem",
  "pfx",
  "pgp",
  "ph",
  "phar",
  "php",
  "pid",
  "pkg",
  "pl",
  "plist",
  "pm",
  "png",
  "po",
  "pom",
  "pot",
  "potx",
  "pps",
  "ppsx",
  "ppt",
  "pptm",
  "pptx",
  "prop",
  "ps",
  "ps1",
  "psd",
  "psp",
  "pst",
  "pub",
  "py",
  "pyc",
  "qt",
  "ra",
  "ram",
  "rar",
  "raw",
  "rb",
  "rdf",
  "rdl",
  "reg",
  "resx",
  "retry",
  "rm",
  "rom",
  "rpm",
  "rpt",
  "rsa",
  "rss",
  "rst",
  "rtf",
  "ru",
  "rub",
  "sass",
  "scss",
  "sdf",
  "sed",
  "sh",
  "sit",
  "sitemap",
  "skin",
  "sldm",
  "sldx",
  "sln",
  "sol",
  "sphinx",
  "sql",
  "sqlite",
  "step",
  "stl",
  "svg",
  "swd",
  "swf",
  "swift",
  "swp",
  "sys",
  "tar",
  "tax",
  "tcsh",
  "tex",
  "tfignore",
  "tga",
  "tgz",
  "tif",
  "tiff",
  "tmp",
  "tmx",
  "torrent",
  "tpl",
  "ts",
  "tsv",
  "ttf",
  "twig",
  "txt",
  "udf",
  "vb",
  "vbproj",
  "vbs",
  "vcd",
  "vcf",
  "vcs",
  "vdi",
  "vdx",
  "vmdk",
  "vob",
  "vox",
  "vscodeignore",
  "vsd",
  "vss",
  "vst",
  "vsx",
  "vtx",
  "war",
  "wav",
  "wbk",
  "webinfo",
  "webm",
  "webp",
  "wma",
  "wmf",
  "wmv",
  "woff",
  "woff2",
  "wps",
  "wsf",
  "xaml",
  "xcf",
  "xfl",
  "xlm",
  "xls",
  "xlsm",
  "xlsx",
  "xlt",
  "xltm",
  "xltx",
  "xml",
  "xpi",
  "xps",
  "xrb",
  "xsd",
  "xsl",
  "xspf",
  "xz",
  "yaml",
  "yml",
  "z",
  "zip",
  "zsh",
];

class FS {
  public saveFiles(username: string, files: File[], directory: string) {
    const userHomeDirectory = `./uploads/${username}`;
    this.handleUserDirectory(userHomeDirectory);
    const destinationDirectory = `${userHomeDirectory}/${directory}`;
    files.forEach((file) => {
      let destinationName = this.checkExitsUpload(
        destinationDirectory,
        file.originalFilename!
      );
      if (!destinationName) return;
      fs.copyFileSync(`./temp/${file.newFilename}`, `${destinationName}`);
      fs.rmSync(`./temp/${file.newFilename}`);
    });
  }

  public getFiles(username: string, directory: string | undefined) {
    let userHomeDirectory = `./uploads/${username}`;
    this.handleUserDirectory(userHomeDirectory);
    if (directory) {
      userHomeDirectory = `${userHomeDirectory}/${directory}`;
    }
    if (!fs.existsSync(userHomeDirectory)) {
      return { files: [], folders: [] };
    }
    const files = fs.readdirSync(userHomeDirectory);
    const fileArr = [];
    const folderArr = [];
    for (let i = 0; i < files.length; i++) {
      const currentFile = `${userHomeDirectory}/${files[i]}`;
      if (fs.statSync(currentFile).isDirectory()) {
        folderArr.push({
          name: files[i],
          path: directory ? `${directory}/${files[i]}` : files[i],
          size: fs.statSync(currentFile).size,
        });
      } else {
        let ext: string = files[i].split(".").pop()!;
        let icon;
        if (fileTypes.includes(ext)) {
          icon = `${ext}.svg`;
        } else {
          icon = `default.svg`;
        }

        fileArr.push({
          name: files[i],
          size: fs.statSync(currentFile).size,
          modified: fs.statSync(currentFile).mtime,
          icon: icon,
        });
      }
    }
    return { files: fileArr, folders: folderArr };
  }

  public getFile(
    username: string,
    directory: string | undefined,
    filename: string
  ) {
    let userHomeDirectory = `./uploads/${username}`;
    this.handleUserDirectory(userHomeDirectory);
    if (directory) {
      userHomeDirectory = `${userHomeDirectory}/${directory}`;
    }
    if (!fs.existsSync(userHomeDirectory)) {
      return { path: "" };
    }
    const filePath = userHomeDirectory + "/" + filename;
    if (!fs.existsSync(filePath)) {
      return { path: "" };
    }
    return { path: filePath };
  }

  public getFileContent(username: string, directory: string) {
    let userHomeDirectory = `./uploads/${username}`;
    if (directory) {
      userHomeDirectory = `${userHomeDirectory}/${directory}`;
    }
    if (!fs.existsSync(userHomeDirectory)) {
      return { content: "" };
    }
    const content = fs.readFileSync(userHomeDirectory, "utf8");
    return { content: content };
  }
  public createFolder(
    username: string,
    directory: string | undefined,
    folderName: string
  ) {
    if (!folderName) return;
    const userHomeDirectory = `./uploads/${username}`;
    if (!fs.existsSync(userHomeDirectory)) {
      return;
    }
    const path = directory
      ? `${userHomeDirectory}/${directory}/${folderName}`
      : `${userHomeDirectory}/${folderName}`;
    let finalFolderName = this.checkExits(path);
    if (!finalFolderName) return;
    fs.mkdirSync(`${finalFolderName}`);
  }

  public createFile(
    username: string,
    directory: string | undefined,
    fileName: string
  ) {
    if (!fileName) return;
    const userHomeDirectory = `./uploads/${username}`;
    if (!fs.existsSync(userHomeDirectory)) {
      return;
    }
    const path = directory
      ? `${userHomeDirectory}/${directory}/${fileName}`
      : `${userHomeDirectory}/${fileName}`;
    let finalFileName = this.checkExits(path);
    if (!finalFileName) return;
    fs.writeFileSync(`${finalFileName}`, "Super");
  }

  public delete(username: string, directory: string, files: string[]) {
    const userHomeDirectory = `./uploads/${username}`;
    files.forEach((file) => {
      const path = `${userHomeDirectory}/${directory}/${file}`;
      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true });
      }
    });
  }

  public rename(
    username: string,
    directory: string,
    oldname: string,
    newname: string
  ) {
    const userHomeDirectory = `./uploads/${username}`;
    const path = `${userHomeDirectory}/${directory}/${oldname}`;
    if (!fs.existsSync(path)) {
      return;
    }
    const newPath = `${userHomeDirectory}/${directory}/${newname}`;
    const finalPath = this.checkExits(newPath, path);
    if (!finalPath) return;
    fs.rename(path, finalPath, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  public move(
    username: string,
    olddirectory: string | undefined,
    oldname: string | undefined,
    newdirectory: string | undefined,
    newname: string | undefined
  ) {
    const userHomeDirectory = `./uploads/${username}`;
    const path = `${userHomeDirectory}/${olddirectory}/${oldname}`;
    if (!fs.existsSync(path)) {
      return;
    }
    const newPath = `${userHomeDirectory}/${newdirectory}/${newname}`;
    const finalPath = this.checkExits(newPath, path);
    if (!finalPath) return;
    fs.cpSync(path, finalPath, { recursive: true });
    fs.rmSync(path, { recursive: true });
  }

  public copy(
    username: string,
    olddirectory: string | undefined,
    oldname: string | undefined,
    newdirectory: string | undefined,
    newname: string | undefined
  ) {
    const userHomeDirectory = `./uploads/${username}`;
    const path = `${userHomeDirectory}/${olddirectory}/${oldname}`;
    if (!fs.existsSync(path)) {
      return;
    }
    const newPath = `${userHomeDirectory}/${newdirectory}/${newname}`;
    const finalPath = this.checkExits(newPath, path);
    if (!finalPath) return;
    fs.cpSync(path, finalPath, { recursive: true });
  }

  public info(
    username: string,
    directory: string | undefined,
    filename: string | undefined
  ) {
    const userHomeDirectory = `./uploads/${username}`;
    const path = `${userHomeDirectory}/${directory}/${filename}`;
    if (!fs.existsSync(path)) {
      return;
    }
    const result = fs.statSync(path);
    const response = {
      name: filename,
      size: result.isDirectory() ? this.getDirectorySize(path) : result.size,
      modified: result.mtime,
    };
    return response;
  }

  private getDirectorySize(path: string) {
    const files = fs.readdirSync(path);
    const stats = files.map((file) => fs.statSync(`${path}/${file}`));
    let sum = 0;
    for (let i = 0; i < stats.length; i++) {
      sum += stats[i].size;
    }
    return sum;
  }

  private handleUserDirectory(userHomeDirectory: string) {
    const homeDirectoryExits = fs.existsSync(userHomeDirectory);
    if (!homeDirectoryExits) {
      fs.mkdirSync(userHomeDirectory);
    }
  }

  private checkExitsUpload(path: string, file: string) {
    let currentIterator = 1;
    const fileName = file.split(".")[0];
    const fileExt = file.split(".").splice(1).join(".");
    while (true) {
      if (!fs.existsSync(`${path}/${fileName}.${fileExt}`)) {
        return `${path}/${fileName}.${fileExt}`;
      }
      if (
        !fs.existsSync(`${path}/${fileName} (${currentIterator}).${fileExt}`)
      ) {
        return `${path}/${fileName} (${currentIterator}).${fileExt}`;
      }
      if (currentIterator > 1000) {
        return;
      }
      currentIterator++;
    }
  }

  private checkExits(path: string, oldPath?: string | undefined) {
    let filename;
    let ext = "";
    if (oldPath) {
      if (!fs.statSync(oldPath).isDirectory()) {
        const splitPath = path.split(".");
        ext = "." + splitPath[splitPath.length - 1];
        splitPath.pop();
        filename = splitPath.join(".");
      } else {
        filename = path;
      }
    } else {
      if (path[0] === ".") {
        const splitPath = path.split(".").splice(1);
        if (splitPath.length > 1) {
          ext = "." + splitPath[splitPath.length - 1];
          splitPath.pop();
        }
        filename = splitPath.join(".");
        filename = "." + filename;
      }
    }
    let currentIterator = 1;
    while (true) {
      if (!fs.existsSync(`${filename}${ext}`)) {
        return `${filename}${ext}`;
      }
      if (!fs.existsSync(`${filename} (${currentIterator})${ext}`)) {
        return `${filename} (${currentIterator})${ext}`;
      }
      if (currentIterator > 1000) {
        return;
      }
      currentIterator++;
    }
  }

  public getImage(username: string, directory: string) {
    let userHomeDirectory = `./uploads/${username}`;
    if (directory) {
      userHomeDirectory = `${userHomeDirectory}/${directory}`;
    }
    if (!fs.existsSync(userHomeDirectory)) {
      return { content: "" };
    }
    const content = fs.readFileSync(userHomeDirectory);
    return Buffer.from(content).toString("base64");
  }

  public saveFile(username: string, finalFile: string, content: string) {
    let userHomeDirectory = `./uploads/${username}`;
    if (finalFile) {
      userHomeDirectory = `${userHomeDirectory}/${finalFile}`;
    }
    if (!fs.existsSync(userHomeDirectory)) {
      return;
    }
    fs.writeFileSync(userHomeDirectory, content);
  }
}

export default new FS();
