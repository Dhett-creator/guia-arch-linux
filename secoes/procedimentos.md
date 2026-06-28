# Procedimentos essenciais

A seguir, serão apresentados alguns procedimentos que considero essenciais após uma instalação limpa do Arch Linux, bem como recomendações de configurações e ajustes que podem otimizar o desempenho, a usabilidade e a experiência geral de uso do sistema.

## Edição do arquivo pacman.conf

Para realizar alterações neste arquivo, primeiro devemos acessá-lo através do seguinte comando:

```bash
$ sudo nano /etc/pacman.conf
```

Feito isso, navegue pelo arquivo até encontrar a linha `#ParallelDownloads = 5`. Após encontrar, descomente a linha removendo o caractere `#`. Com o parâmetro `ParallelDownloads = 5` descomentado, as instalações e atualizações de pacotes passarão a ser baixadas utilizando 5 downloads simultaneamente, proporcionando um melhor aproveitamento da banda de internet. Além disso, recomenda-se descomentar a linha `#Color`, que habilita a exibição de cores no terminal. Esse recurso melhora a legibilidade das informações apresentadas, tornando a saída dos comandos mais clara e organizada.

Opcionalmente, podemos acrescentar a linha `ILoveCandy` ao arquivo. Está linha irá modificar a aparência das barras de progresso no terminal para algo semelhante ao game **Pacman**. Esta linha pode ser acrescentada logo após o parâmetro `ParallelDownloads = 5`. Essa modificação é valida apenas para o gerenciador de pacotes `pacman`.

## Instalação de um gestor de *Firmware*

Para a gestão/atualização de *firmware* da sua maquina, existe um pacote chamado `fwupd`. Quando instalado, este pacote se integra automaticamente a Gnome Software, permitindo que a mesma procure também por atualizações de *firmware*, além das atualizações convencionais de programas. Para instalação do `fwupd`, basta rodar:

```bash
$ sudo pacman -S fwupd
```

## Adicionar suporte ao formato NTFS

Por padrão o Arch Linux não traz suporte para sistema de arquivos do tipo NTFS. O comando a seguir instala o pacote `ntfs-3g`, o qual é responsável por adicionar suporte a este tipo de sistema de arquivos:

```bash
$ sudo pacman -S ntfs-3g
```

## Ativação do serviço de Bluetooth

Nas versões atuais do *Archinstall*, é oferecida ao usuário a opção de habilitar o serviço de *bluetooth* durante a instalação do sistema. Caso a ativação dessa opção seja esquecida, após a instalação basta executar os seguintes comandos para ativar o serviço:

```bash
$ sudo systemctl enable --now bluetooth.service
```

## Manutenção do cache do pacman

O gerenciador de pacotes do Arch Linux, o `pacman`, mantém um cache de todos os pacotes baixados e instalados no sistema. Com o tempo, esse cache pode ocupar uma quantidade significativa de espaço em disco. Para evitar que isso aconteça, é recomendado configurar uma rotina de limpeza automática do cache. Para isso, exite uma ferramenta chamada `paccache` que está presente no pacote `pacman-contrib`:

```bash
$ sudo pacman -S pacman-contrib
```

Para usar essa ferramenta, basta executar:

```bash
$ sudo paccache -r
```

Por padrão, o `paccache` remove todos os pacotes do cache que não estão instalados no sistema e mantem até duas versões diferentes do *Kernel*.

Para não ter que se preocupar em ter que rodar esse comando eventualmente no futuro, você pode ativar um serviço do `systemd`:

```bash
$ sudo systemctl enable --now paccache.timer
```

Isso vai rodar a limpeza uma vez por semana de forma silenciosa. Para ter certeza de que o comando está configurado para rodar semanalmente, você pode usar o comando de listagem de timers:

```bash
$ systemctl list-timers paccache.timer
```

## Instalação e ativação do firewall

Para realizar a instalação de um firewall, vamos instalar o pacote `ufw`:

```bash
$ sudo pacman -S ufw
```

Assim que instalado, será necessário a ativação do serviço do `ufw`:

```bash
$ sudo systemctl enable --now ufw
```

Além de iniciar o serviço imediatamente, esse comando também o habilita para ser executado automaticamente durante a inicialização do sistema.

## Alteração do tamanho da memória *swap*

O *script* de instalação do *Archinstall* configura, por padrão, um valor de memória *swap* em torno de 4 GB. Esse valor pode ser considerado pequeno para computadores com 8 GB ou mais de RAM, especialmente quando o usuário costuma utilizar o modo de suspensão, no qual o estado atual da sessão é salvo na memória *swap*.

Por esse motivo, é importante definir um valor adequado de acordo com cada caso. Pessoalmente, costumo adotar uma quantidade de *swap* equivalente à memória RAM do dispositivo. Ou seja, se o computador possui 8 GB de RAM, defino 8 GB de *swap*; se possui 16 GB de RAM, defino também 16 GB de *swap*.

Para ajustarmos esse valor, devemos editar o arquivo de configuração do `zram-generator`:

```bash
$ sudo nano /etc/systemd/zram-generator.conf
```

Dentro dele, adicione ou altere, caso já exista, a seguinte seção:

```bash:line-numbers
[zram0]
zram-size = 8192
compression-algorithm = zstd
```

Neste exemplo, configurei o equivalente a aproximadamente 8 GB de *swap*. No entanto, a quantidade ideal fica a critério do usuário.

## Instalação de *codecs* multimídia

Para que não haja possíveis incompatibilidades com formatos de mídias específicos, o comando a seguir instala todos os *codecs* necessários para quaisquer tipos de arquivos de mídia:

```bash
$ sudo pacman -S ffmpeg gst-plugins-ugly gst-plugins-good gst-plugins-base gst-plugins-bad gst-libav gstreamer
```

## Instalação e ativação do módulo TLP (Apenas para notebooks)

Se o Arch Linux for instalado em um notebook, o uso do TLP é praticamente indispensável. Esse módulo é responsável por gerenciar o consumo de energia, otimizando o desempenho do processador e prolongando a duração da bateria. Para instalá-lo:

```bash
$ sudo pacman -S tlp
```

Para ativá-lo e evitar conflitos com o `systemd-rfkill`:

```bash
$ sudo systemctl enable tlp.service
```
```bash
$ sudo systemctl mask systemd-rfkill.service systemd-rfkill.socket
```
Após a reinicialização o modulo já estará funcionando.

## Adicionar suporte a *emojis*

A fonte padrão do Arch Linux não possui suporte para *emojis*, acarretando em fontes genéricas ou transfiguradas em determinadas ocasiões. O comando a seguir adiciona um conjunto de *emojis* ao sistema:

```bash
$ sudo pacman -S noto-fonts noto-fonts-emoji ttf-liberation ttf-droid adobe-source-sans-fonts ttf-dejavu
```

## Adicionar suporte a geração de miniaturas de vídeos no *nautilus*

Após a mudança de *player* de vídeo padrão que o Gnome sofreu, as miniaturas dos vídeos no *nautilus* são geradas agora pelo pacote `ffmpegthumbnailer`. Esse pacote dever ser instalado junto com o `gst-plugin-ffmpeg`: 

```bash
$ sudo pacman -S ffmpegthumbnailer gst-plugin-ffmpeg
```

Após isso é necessário apagar o cache de miniaturas e gerá-las novamente:

```bash
$ rm -rf ~/.cache/thumbnails/*
```

Feito isso, abra o *nautilus* novamente e navegue até a pasta de vídeos e verifique o resultado.

## Adicionar suporte ao AUR (opcional)

O *Arch User Repository* (AUR) é onde a comunidade compartilha pacotes que não estão nos repositórios oficiais. Para instalar programas do AUR é necessário um *helper*. O `yay` é um dos mais populares, e para instalá-lo basta:

```bash
$ sudo pacman -S --needed git base-devel
```
```bash
$ git clone https://aur.archlinux.org/yay.git
```
```bash
$ cd yay
```
```bash
$ makepkg -si
```

Para instalar pacotes do AUR utiliza-se o comando:

```bash
$ yay -S nome-do-pacote
```

## Pacotes Adicionais

A seguir deixarei um comando de instalação de alguns pacotes que não são obrigatórios para todos os usuários, mas acredito que podem ser úteis em diversas ocasiões:

```bash
$ sudo pacman -S unrar p7zip fastfetch exfatprogs dosfstools mediainfo rsync
```

