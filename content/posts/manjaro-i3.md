---
title: Linux
date: 2019-11-10
tags:
  - linux
---

![desktop](../images/manjaro-i3/desktop.jpeg)

## Our Story

说来也挺幸运的，与 Manjaro Linux 的一场偶遇似乎改变了我整个大一的轨迹，不如说是我在计算机领域的另一位启蒙老师吧。

如果一个月以前的我没有决定安装 Linux + Windows 双系统的话，也许现在我还不知道开源是什么，也许现在我还不会用 git 和 GitHub... 在这一个多月的时间里，从一开始的 KDE 桌面折腾到 i3wm，从 Visual Studio Code 折腾到 neovim + coc，从默认的 shell 折腾到 fish + omf，从自带的 terminal emulator 折腾到 alacritty... 在编写各种配置文件，完成各种个性化定制的同时，我也熟悉并喜欢上了命令行环境的高效优雅，爱上了 \*nix 阵营的极简主义，并对开源的理念产生了某种心理认同。确实，各种配置也许显得很费时间，经常熬夜修改各种环境错误，在 GitHub issue 区到处寻找解答，但是在这一个月里，我与计算机之间的距离仿佛被拉近，内心也萌发了一个关于理想的美好愿望，不如说，这也算是某种缘分吧。

也许在未来的某天，我会切换 macOS 为主力系统；也许在未来的某天，我会回到 vscode，只不过配上了 vim plugin，也许我不能再称自己为一个纯正的 Linux User。但是，有些事物一旦相识，便刻入骨髓了啊。

## Some Notes

- 切换镜像源：  
  `sudo pacman-mirrors -i -c China -m rank`   
  `sudo pacman -Syy` `sudo vim /etc/pacman.conf`
  ```
  [archlinuxcn]
  SigLevel = Optional TrustedOnly
  Server = https://mirrors.sjtug.sjtu.edu.cn/archlinux-cn/$arch
  ```
  `sudo pacman -S archlinuxcn-keyring` `sudo pacman -Syyu`
- 安装输入法：`yay -S ibus-rime`  
  `ibus-setup`，选择 Input > Add > Chinese > Rime  
  `vim ~/.xprofile`
  ```
  export GTK_IM_MODULE=ibus
  export XMODIFIERS=@im=ibus
  export QT_IM_MODULE=ibus
  ibus-daemon -x -d
  ```

- 运行 `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` 时报错 `curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to sh.rustup.rs:443`，关闭当前网络的 IPv6 连接之后重试。
- 代理：使用 [Clashy](https://github.com/SpongeNobody/Clashy) 和 [CordCloud](https://www.cordcloud.site/)，终端设置同 [macOS](https://github.com/raptazure/aurora/issues/13)
- TIM on i3wm: `pacman -S deepin.com.qq.office`

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
