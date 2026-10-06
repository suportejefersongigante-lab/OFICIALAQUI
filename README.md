# 🚀 BoraFechar

Assistente pessoal que conversa com você e ajuda a fechar o mês. PWA em HTML/CSS/JS puro: **sem build, sem backend, sem banco**. Dados ficam no `localStorage` do aparelho.

## 1. Instalar dependências
Nenhuma. 

## 2. Rodar localmente
Service workers exigem servidor (não abra o arquivo direto):
```
python3 -m http.server 8080
```
Acesse http://localhost:8080

## 3. Gerar build
Não há build. A pasta raiz já é a versão de produção.

## 4. Publicar no GitHub Pages
1. Crie um repositório e envie estes arquivos para a branch `main`. **O `index.html` precisa ficar na raiz do repositório** (não dentro de uma subpasta nem dentro do .zip).
2. Jeito mais simples: **Settings → Pages → Source = Deploy from a branch** → `main` / `(root)` → Save.
3. Opcional: para usar o deploy automático (`.github/workflows/deploy.yml`), escolha Source = **GitHub Actions**.
Todos os caminhos são relativos, então funciona em `usuario.github.io/repositorio/`.

## 5. Instalar no Android
Chrome → menu ⋮ → **Instalar app** (ou *Adicionar à tela inicial*).

## 6. Instalar no iPhone
Safari → botão Compartilhar → **Adicionar à Tela de Início**.

## 7. Estrutura
```
index.html  styles.css  app.js
manifest.json  service-worker.js
icons/  (icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png)
.github/workflows/deploy.yml
```

## 8. Personalizar
- **Nome:** `index.html` (`<title>`, meta), `manifest.json`, textos em `app.js`.
- **Ícone:** troque os arquivos em `icons/` (mantenha os nomes/tamanhos).
- **Cores:** variáveis `:root` no topo de `styles.css`.
- **Ideias de renda:** array `IDEAS` em `app.js` (são apenas estimativas, nunca promessas).
- Ao alterar arquivos, aumente `V` em `service-worker.js` para atualizar o cache.
