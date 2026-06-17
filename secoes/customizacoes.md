# Ajustes e customizações

A seguir, serão apresentados ajustes que considero essenciais, como a ocultação de ícones indesejáveis na grade de aplicativos do Gnome, bem como ajustes visuais obtidos através de temas para aplicativos que ainda não foram portados para GTK4.

## Ocultação de ícones da grade de aplicativos do Gnome

Diferente de outras distribuições, o Arch Linux não costuma ocultar por padrão alguns ícones desnecessários na grade de aplicativos do Gnome. A ocultação desses ícones pode ser feita adicionando um único parâmetro ao arquivo `.desktop` correspondente ao aplicativo. Esses arquivos ficam localizados em:

```bash
$ cd /usr/share/applications/
```

Para listar todos os arquivos dentro do diretório:

```bash
$ ls
```

Após localizar o arquivo `.desktop` do aplicativo que deseja ocultar, basta adicionar o parâmetro `NoDisplay=true` ao final do arquivo e, em seguida, salvar e fechar. Porém, para que as mudanças permaneçam mesmo após a atualização do aplicativo, é necessário copiar esses arquivos para a sua pasta local de configurações, `~/.local/share/applications/`. Quando você coloca um arquivo `.desktop` com o mesmo nome nessa pasta, o sistema ignora o arquivo original em `/usr/share/`. Como essa pasta está dentro da sua `Home`, o pacman nunca vai mexer nela.

Em geral, estes são os aplicativos que costumo ocultar:

```bash
avahi-discover.desktop
bssh.desktop
bvnc.desktop
qv4l2.desktop
qvidcap.desktop
nm-connection-editor.desktop
nvim.desktop
xdvi.desktop
```

Em vez de copiar e editar um por um manualmente, você pode usar este comando no terminal para automatizar o processo para todos os itens da sua lista (**Cole o comando completo no terminal**):

::: code-group
```bash
$ mkdir -p ~/.local/share/applications/

apps=(
  avahi-discover.desktop
  bssh.desktop
  bvnc.desktop
  qv4l2.desktop
  qvidcap.desktop
  nm-connection-editor.desktop
  nvim.desktop
  xdvi.desktop
)

for app in "${apps[@]}"; do
  if [ -f /usr/share/applications/"$app" ]; then
    cp /usr/share/applications/"$app" ~/.local/share/applications/
    # Remove a linha NoDisplay se ela já existir para não duplicar, depois adiciona
    sed -i '/NoDisplay=/d' ~/.local/share/applications/"$app"
    echo "NoDisplay=true" >> ~/.local/share/applications/"$app"
    echo "Sucesso: $app agora está oculto."
  else
    echo "Aviso: $app não encontrado em /usr/share/applications/"
  fi
done
```

```fish
mkdir -p ~/.local/share/applications/

set apps avahi-discover.desktop bssh.desktop bvnc.desktop qv4l2.desktop qvidcap.desktop nm-connection-editor.desktop nvim.desktop xdvi.desktop

for app in $apps
  if test -f /usr/share/applications/$app
    cp /usr/share/applications/$app ~/.local/share/applications/
    sed -i '/NoDisplay=/d' ~/.local/share/applications/$app
    echo "NoDisplay=true" >> ~/.local/share/applications/$app
    echo "Sucesso: $app agora está oculto localmente."
  else
    echo "Aviso: $app não encontrado em /usr/share/applications/"
  end
end
```
:::

:::tip AVISO
Note que também há uma versão do código para o `fish`, caso o utilize como shell padrão.
:::
## Instalação do tema adw-gtk3

O tema `adw-gtk3` deixa a aparência dos aplicativos ainda baseados em GTK3 semelhante à dos aplicativos já portados para GTK4. No Arch Linux, esse tema já está disponível nos repositórios oficiais da distribuição:

```bash
$ sudo pacman -S adw-gtk-theme
```

Para aplicação do tema em aplicativos flatpak é recomendado também instalar:

```bash
$ flatpak install org.gtk.Gtk3theme.adw-gtk3 org.gtk.Gtk3theme.adw-gtk3-dark
```

Após isso, basta selecionar o tema através do aplicativo **Ajustes**.

## Customização do terminal

Para personalizar o terminal no Arch Linux, serão necessários três pacotes. O primeiro é o `Fish`, um shell voltado à interatividade, que oferece nativamente recursos como sugestões automáticas de comandos e destaque de sintaxe. O segundo é o `Starship`, responsável pelo prompt minimalista e universal, exibindo informações contextuais — como o diretório atual e o estado de repositórios Git. Por fim, o `Eza`, que substitui o comando `ls`, fornecendo cores inteligentes de acordo com o tipo de arquivo e uma visualização hierárquica organizada em forma de árvore.

Instalação dos pacotes:

```bash
$ sudo pacman -S fish starship eza ttf-hack-nerd
```

Incluí o pacote `ttf-hack-nerd`, necessário para a exibição correta dos ícones. Após a instalação dos pacotes, acesse as configurações do terminal e escolha a fonte **Hack Nerd Font Mono** como padrão.

Torne o `fish` o seu shell padrão:

```bash
$ chsh -s /usr/bin/fish
```

Para que esse comando tenha efeito, é necessário encerrar a sessão (log out) e entrar novamente, mas isso pode ser feito após concluir todo o processo de customização.

Para configuração do fish, crie o diretório:

```bash
$ mkdir -p ~/.config/fish
```

Crie e edite o arquivo:

```bash
$ nano ~/.config/fish/config.fish
```

Adicione o seguinte conteúdo:

```bash:line-numbers
starship init fish | source

# Silencia a mensagem de boas vindas do fish
set -g fish_greeting ""

# Atalho para a sessão Tmux do rTorrent (Opcional)
alias rt='/usr/bin/tmux a -t rtorrent'

# Substituir o ls pelo eza com cores inteligentes
alias ls='eza --icons --group-directories-first --color=always --no-quotes'
alias ll='eza -lh --icons --group-directories-first --no-quotes'
alias la='eza -a --icons --group-directories-first --no-quotes'
alias lt='eza --tree --level=2 --icons --no-quotes'
```

Para configuração do `Starship` abra ou crie, se não existir, o seguinte arquivo:

```bash
$ nano ~/.config/starship.toml
```

Dentro dele, cole:

```bash:line-numbers
"$schema" = 'https://starship.rs/config-schema.json'

format = """
[](color_orange)\
$os\
$username\
[](bg:color_yellow fg:color_orange)\
$directory\
[](fg:color_yellow bg:color_aqua)\
$git_branch\
$git_status\
[](fg:color_aqua bg:color_blue)\
$c\
$cpp\
$rust\
$golang\
$nodejs\
$php\
$java\
$kotlin\
$haskell\
$python\
[](fg:color_blue bg:color_bg3)\
$docker_context\
$conda\
$pixi\
[](fg:color_bg3 bg:color_bg1)\
$time\
[ ](fg:color_bg1)\
$line_break$character"""

palette = 'gruvbox_dark'

[palettes.gruvbox_dark]
color_fg0 = '#fbf1c7'
color_bg1 = '#3c3836'
color_bg3 = '#665c54'
color_blue = '#458588'
color_aqua = '#689d6a'
color_green = '#98971a'
color_orange = '#d65d0e'
color_purple = '#b16286'
color_red = '#cc241d'
color_yellow = '#d79921'

[os]
disabled = false
style = "bg:color_orange fg:color_fg0"

[os.symbols]
Windows = "󰍲"
Ubuntu = "󰕈"
SUSE = ""
Raspbian = "󰐿"
Mint = "󰣭"
Macos = "󰀵"
Manjaro = ""
Linux = "󰌽"
Gentoo = "󰣨"
Fedora = "󰣛"
Alpine = ""
Amazon = ""
Android = ""
AOSC = ""
Arch = "󰣇"
Artix = "󰣇"
EndeavourOS = ""
CentOS = ""
Debian = "󰣚"
Redhat = "󱄛"
RedHatEnterprise = "󱄛"
Pop = ""

[username]
show_always = true
style_user = "bg:color_orange fg:color_fg0"
style_root = "bg:color_orange fg:color_fg0"
format = '[ $user ]($style)'

[directory]
style = "fg:color_fg0 bg:color_yellow"
format = "[ $path ]($style)"
truncation_length = 3
truncation_symbol = "…/"

[directory.substitutions]
"Documentos" = "󰈙 "
"Downloads" = " "
"Músicas" = "󰝚 "
"Imagens" = " "
"Developer" = "󰲋 "
"Vídeos" = "󰿎 "

[git_branch]
symbol = ""
style = "bg:color_aqua"
format = '[[ $symbol $branch ](fg:color_fg0 bg:color_aqua)]($style)'

[git_status]
style = "bg:color_aqua"
format = '[[($all_status$ahead_behind )](fg:color_fg0 bg:color_aqua)]($style)'

[nodejs]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[c]
symbol = " "
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[cpp]
symbol = " "
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[rust]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[golang]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[php]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[java]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[kotlin]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[haskell]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[python]
symbol = ""
style = "bg:color_blue"
format = '[[ $symbol( $version) ](fg:color_fg0 bg:color_blue)]($style)'

[docker_context]
symbol = ""
style = "bg:color_bg3"
format = '[[ $symbol( $context) ](fg:#83a598 bg:color_bg3)]($style)'

[conda]
style = "bg:color_bg3"
format = '[[ $symbol( $environment) ](fg:#83a598 bg:color_bg3)]($style)'

[pixi]
style = "bg:color_bg3"
format = '[[ $symbol( $version)( $environment) ](fg:color_fg0 bg:color_bg3)]($style)'

[time]
disabled = false
time_format = "%R"
style = "bg:color_bg1"
format = '[[  $time ](fg:color_fg0 bg:color_bg1)]($style)'

[line_break]
disabled = false

[character]
disabled = false
success_symbol = '[❯](bold fg:color_green)'
error_symbol = '[❯](bold fg:color_red)'
vimcmd_symbol = '[❮](bold fg:color_green)'
vimcmd_replace_one_symbol = '[❮](bold fg:color_purple)'
vimcmd_replace_symbol = '[❮](bold fg:color_purple)'
vimcmd_visual_symbol = '[❮](bold fg:color_yellow)'
```

Depois de salvar e fechar o arquivo, reinicie a seção.

::: tip DICA BÔNUS 
Se você utiliza pacotes Flatpak e do AUR com o gerenciador de pacotes `yay`, além de usar o `fish` como shell padrão, é possível criar um atalho chamado `up` para atualizar todos os pacotes do sistema de uma única vez. Basta colar o comando completo abaixo no terminal e executá-lo:

```bash
$ echo 'function up
  sudo -v

  echo -e "\n"(set_color --bold brblue)"🚀 Atualizando Flatpaks..."(set_color normal)"\n"
  flatpak update -y

  echo -e "\n"(set_color --bold brblue)"📦 Atualizando Pacotes dos Repositórios e do AUR..."(set_color normal)"\n"
  yay -Syu
end' > ~/.config/fish/functions/up.fish
```
:::
## Trocando o Gnome-Console pelo terminal Ghostty

O Ghostty é um emulador de terminal excelente, escrito em Zig, incrivelmente rápido e com renderização via GPU. Para instalá-lo:

```bash
$ sudo pacman -S ghostty ghostty-nautilus ttf-hack-nerd ttf-jetbrains-mono-nerd
```

O pacote `ghostty-nautilus` permite integrar o Ghostty ao explorador de arquivos do Gnome, o nautilus. Os pacotes `ttf-hack-nerd` e `ttf-jetbrains-mono-nerd`, são apenas fontes que recomendo para serem utilizados com o Ghostty.

Após a instalação, podemos remover o `gnome-console`:

```bash
$ sudo pacman -R gnome-console
```

Diferente de outros emuladores de terminal, o Ghostty não possui uma interface de configurações embutida. Suas configurações são realizadas em um arquivo de texto separado, `~/.config/ghostty/config.ghostty`. Abra o arquivo com:

```bash
$ nano ~/.config/ghostty/config.ghostty
```

E cole o seguinte conteúdo dentro do arquivo:

```bash:line-numbers
# ~/.config/ghostty/config.ghostty

# --- Fonte ---
# font-family = "JetBrainsMono Nerd Font"
font-family = "Hack Nerd Font Mono"
font-size = 12

# --- Tema e Aparência ---
theme = Adwaita Dark

# --- Comportamento ---
# Garante que o terminal inicie diretamente no seu shell
#command = /usr/bin/fish
shell-integration = fish

# Copiar automaticamente ao selecionar o texto
copy-on-select = clipboard

# Desativar o sino do terminal
#keybind = global:ctrl+shift+c=copy
#keybind = global:ctrl+shift+v=paste

# --- Tamanho da Janela ---
# O Ghostty usa colunas e linhas como medida de tamanho.
# Ajuste os valores abaixo até encontrar o tamanho ideal para o seu monitor.
window-width = 150
window-height = 50

# --- Rolagem e Mouse ---
# Multiplicador da velocidade de rolagem.
# O valor padrão é 1. Reduzir esse valor (ex: 0.5 ou 0.3) fará com que o
# touchpad ou o scroll do mouse desçam menos linhas por movimento,
# tornando a experiência bem mais suave.
mouse-scroll-multiplier = 0.5
```

