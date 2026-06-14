# Formatação de dispositivos removíveis

Formatar um pendrive ou HD externo pelo terminal do Arch Linux é um processo direto, mas que exige bastante atenção. Como estamos lidando com a linha de comando, um erro de digitação pode acabar formatando o disco errado (como o seu disco principal com o sistema operacional).

::: danger AVISO
Este procedimento apagará todos os dados do disco selecionado. Certifique-se de que você tem backups de todos os arquivos importantes e verifique mais de uma vez se selecionou a unidade correta. Vamos ao passo a passo.
:::

Primeiro, precisamos descobrir qual é a identificação do disco no sistema:

```bash
lsblk
```

Você verá uma lista de todos os discos e partições conectados. Procure pelo disco que deseja formatar se baseando no tamanho dele.

Para os próximos passos, vou usar `/dev/sdX` para representar o disco e `/dev/sdX1` para a partição. Substitua o "X" pela letra correspondente ao seu HD externo (ex: `sdc`).

O Linux não permite formatar uma partição que está em uso (montada). Se o seu sistema montou o disco automaticamente quando você o conectou, você precisa desmontá-lo:

```bash
sudo umount /dev/sdX1
```

Se o disco tiver mais de uma partição, repita o comando para `sdX2`, `sdX3`, etc.

Para uma formatação limpa do zero, é recomendado recriar a tabela de partições usando o `fdisk`: 

```bash
sudo fdisk /dev/sdX
```

Digite `g` e pressione **Enter** para criar uma nova tabela de partições GPT (padrão moderno), ou `o` para uma tabela MBR (DOS) se o disco for antigo ou precisar de compatibilidade com sistemas legados.

::: warning AVISO
Em alguns casos, pode ser que o `fdisk` exiba uma mensagem, após o comando `g`, informando que foi encontrado vestígios de uma tabela de partições antiga e recomende usar o comando `wipefs` para limpar assinaturas antigas. Para isso, no prompt `Comando (m para ajuda):`, digite a letra `q` e aperte **Enter**. Isso vai cancelar a operação atual e nos devolver ao terminal normal. Após isso, usamos: `sudo wipefs -a /dev/sdX` para apagar qualquer vestígio de formatações anteriores. Uma vez que o disco esteja completamente "zerado", vamos voltar para o plano original digitando novamente: `sudo fdisk /dev/sdX` e, em seguida digitando g para criar a tabela de partições.
:::

Depois, digite `n` e pressione **Enter** para criar uma nova partição. Você pode apenas pressionar **Enter** em todas as perguntas seguintes para aceitar os valores padrão (isso criará uma única partição ocupando todo o disco).

Por ultimo, digite `w` e pressione **Enter** para salvar as alterações e sair.

Agora precisamos escolher o formato (sistema de arquivos) que melhor atende às nossas necessidades. Para isso vou deixar três comandos para sistemas de arquivos diferentes (`ext4`, `exFat` e `NTFS`).

**ext4 (Padrão Linux):** Excelente se for usar o disco apenas em sistemas Linux.

```bash
sudo mkfs.ext4 /dev/sdX1
```

**exFAT (Recomendado para uso misto):** A melhor opção se planeja usar o disco em computadores com Windows, macOS e Linux, pois possui suporte nativo de leitura e escrita em todos eles sem limite de tamanho de arquivo. Antes, é importante garantir que o pacote necessário está instalado no sistema:

```bash
sudo pacman -S exfatprogs
sudo mkfs.exfat /dev/sdX1
```

**NTFS (Padrão Windows):** Escolha se o foco principal for o uso em Windows. Antes, garanta que você tem o pacote necessário instalado no Arch:

```bash
sudo pacman -S ntfs-3g
sudo mkfs.ntfs -f /dev/sdX1
```

Para garantir que todas as operações foram concluídas e que é seguro remover o disco fisicamente:

```bash
sync
```

Pronto! Seu HD externo está formatado e pronto para uso.

::: tip DICA BÔNUS
Durante a formatação, também podemos definir um nome para o disco. Para isso, execute um dos três comandos abaixo de acordo com o sistema de arquivos desejado, alterando apenas o nome do disco:
:::

```bash
sudo mkfs.ext4 -L "MEU_HD" /dev/sdX1
sudo mkfs.exfat -L "MEU_HD" /dev/sdX1
sudo mkfs.ntfs -f -L "MEU_HD" /dev/sdX1
```

Se tiver rodado o comando do passo anterior sem ter definido um nome mara a unidade, não se preocupe, não precisa formatar o disco novamente e desgastá-lo à toa. Podemos apenas "renomear" a partição no sistema usando utilitários específicos para cada formato:

Se formatou em `ext4`:

```bash
sudo e2label /dev/sdX1 "MEU_HD"
```

Se formatou em `exFAT`:

```bash
sudo exfatlabel /dev/sdc1 "MEU_HD"
```

Se formatou em `NTFS`:

```bash
sudo ntfslabel /dev/sdX1 "MEU_HD"
```

