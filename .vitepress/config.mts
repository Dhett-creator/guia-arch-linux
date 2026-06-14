import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Guia Arch Linux",
  description: "Tutorial avançado de pós-instalação e automação.",
  
  // Muda o idioma base do site para melhorar acessibilidade e SEO
  lang: 'pt-BR',

  // Ativa o recurso de data de atualização (baseado nos commits do Git)
  lastUpdated: true,

  themeConfig: {
    // Menu superior (Navbar)
    nav: [
      { text: 'Início', link: '/' },
      { text: 'O Guia', link: '/secoes/introducao' }
    ],

    // Rodapé da página inicial
    footer: {
      message: 'Lançado sob a licença MIT',
      copyright: 'Direitos reservados © 2025-2026 Dhett'
    },

    // Tradução e formatação da data de modificação
    lastUpdated: {
      text: 'Atualizado em',
      formatOptions: {
        dateStyle: 'short', // Exibe no formato DD/MM/AAAA
        timeStyle: 'medium' // Exibe no formato HH:MM:SS
      }
    },

    // Menu lateral (Sidebar)
    sidebar: [
      {
        //text: 'Começando',
        items: [
          { text: 'Introdução', link: '/secoes/introducao' },
          { text: 'Procedimentos Essenciais', link: '/secoes/procedimentos' },
          { text: 'Ajustes e customizações', link: '/secoes/customizacoes' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // Traduções da interface nativa do VitePress
    outline: {
      label: 'Nesta página'
    },
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página'
    },
    returnToTopLabel: 'Voltar ao topo',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Aparência',
    lightModeSwitchTitle: 'Mudar para modo claro',
    darkModeSwitchTitle: 'Mudar para modo escuro'
  }
})
