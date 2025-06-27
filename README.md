# pucangels

Aplicação PUC Angels usando React + Vite + Supabase.

## Sobre

Este repositório contém o front-end da aplicação PUC Angels, que faz uso de:

- **React** (via Vite)  
- **TypeScript**  
- **Supabase** para autenticação (Google OAuth) e banco de dados

## Scripts disponíveis

- `npm run dev` — Executa o servidor de desenvolvimento (Vite)  
- `npm run build` — Cria a build de produção em `dist/`  
- `npm run preview` — Serve a build de produção localmente

## Deploy

Esta aplicação pode ser implantada em plataformas como Vercel, Netlify ou no próprio Supabase Hosting (beta).  

Para Vercel, siga:

1. Conecte este repositório no Vercel  
2. Defina as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Execute o deploy  

---