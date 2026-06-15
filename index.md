---
layout: home

hero:
  name: "Guia de Pós-instalação:"
  text: "Arch Linux e Derivados"
  tagline: "Otimizações, scripts de automação e configurações avançadas para o seu sistema."
  image:
    src: /archlinux-icon.svg
    alt: Arch Linux Logo
  actions:
    - theme: brand
      text: Começar a ler
      link: /secoes/procedimentos
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/Dhett-creator/guia-arch-linux

features:
  - title: Configurações Essenciais
    details: Otimização do pacman, gestão de swap com zram, ativação de firewall e codecs multimídia para um sistema redondo logo no primeiro boot.
  - title: Automação de Torrents
    details: Scripts completos em Python e Bash para monitoramento automático de pastas e integração limpa do qBittorrent e rTorrent com o systemd.
  - title: Customização de Terminal
    details: Substitua o bash padrão pelo Fish shell, configure o prompt do Starship e eleve a produtividade usando emuladores acelerados via GPU.
---

<style>
/* Regra da imagem (já estava aqui) */
.VPHero .image-src {
  width: 250px !important;
  max-width: 250px !important;
  height: auto !important;
  margin: 0 auto !important;
}

/* Nova regra para o Título (Força a ficar em uma linha no PC) */
@media (min-width: 768px) {
  .VPHero .name,
  .VPHero .text {
    white-space: nowrap !important;
  }
}
</style>
