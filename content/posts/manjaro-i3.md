---
title: Manjaro Linux
date: 2019-11-10
tags:
  - tooling
---

![desktop](../images/manjaro-i3/desktop.jpeg)

## Some Notes

- 切换镜像源：  
  `sudo pacman-mirrors -i -c China -m rank`   
  `sudo pacman -Syy` `sudo vim /etc/pacman.conf`
  ```
  [archlinuxcn]
  SigLevel = Optional TrustedOnly
  Server = https://mirrors.sjtug.sjtu.edu.cn/archlinux-cn/$arch
  ```
  `sudo pacman -S archlinuxcn-keyring` `sudo pacman -Syy`
- 安装输入法：`yay -S ibus-rime`  
  `ibus-setup`，选择 Input > Add > Chinese > Rime  
  `vim ~/.xprofile`
  ```
  export GTK_IM_MODULE=ibus
  export XMODIFIERS=@im=ibus
  export QT_IM_MODULE=ibus
  ibus-daemon -x -d
  ```

- Fix crackling and popping sound when using headphones: pactl unload-module module-suspend-on-idle.
- Fix touchscreen scrolling in Firefox: Edit `/etc/security/pam_env.conf` and add `MOZ_USE_XINPUT2 DEFAULT=1`. Reboot and restart firefox.
- Stack 换源和安好 make 之后再装 Simple-GHC。
- 博客迁移： `sudo pacman -S autoconf pkgconf automake libtool nasm` 来让 mozjpeg 可以编译，如果某 sass 文件报错就在相应位置加个 `display: none`。
- 运行 `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` 时报错 `curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to sh.rustup.rs:443`，关闭当前网络的 IPv6 连接之后重试。
- 代理：使用 [Clashy](https://github.com/SpongeNobody/Clashy) 和 [CordCloud](https://www.cordcloud.site/)，终端设置可以直接 export，Firefox 记得在 proxy 设置中下面那几个打上勾勾，Chrome 要设置好 System Proxy。
- TIM on i3wm: `sudo pacman -S deepin.com.qq.office`

  ​ 1. install `gnome-settings-daemon`  
  ​ 2. run `nohup /usr/lib/gsd-xsettings > /dev/null 2>&1 &`  
  ​ 3. execute `./opt/deepinwine/apps/Deepin-TIM/run.sh`

- My [dotfiles](https://github.com/raptazure/dotfiles) on GitHub.
  
## Appendix

- `fish` - A smart and user-friendly command shell for Linux.

- `oh-my-fish` - A fishshell framework that allows you to install packages which extend or modify the look and feel of your shell.

- `alacritty` - A free open-source, fast, cross-platform terminal emulator, that uses GPU (Graphics Processing Unit) for rendering. Alacritty is focused on two goals simplicity and performance.

- `ranger` - A lightweight and powerful file manager that works in a terminal window and it comes with vi/vim key bindings!

- `albert` - Access everything with virtually zero effort. Run applications, open files or their paths, open bookmarks in your browser, search the web, calculate things and a lot more … It is a desktop agnostic launcher and its goals are usability and beauty.

- `dmenu` - A fast and lightweight dynamic menu for X. It reads arbitrary text from stdin, and creates a menu with one item for each line. The user can then select an item, through the arrow keys or typing a part of the name, and the line is printed to stdout.

- `variety` - A wallpaper manager for Linux systems. It supports numerous desktops and wallpaper sources, including local files and online services: Flickr, Wallhaven, Unsplash, and more.

- `polybar` - A fast and easy-to-use tool for creating status bars. Polybar aims to help users build beautiful and highly customizable status bars.

- `compton` - A compositor for X.

- `neovim` - Hyperextensible Vim-based text editor.
