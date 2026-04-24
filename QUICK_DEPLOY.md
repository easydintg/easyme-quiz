# ⚡ БЫСТРЫЙ ДЕПЛОЙ БЕЗ АРХИВА

## Способ 1: Vercel CLI (САМЫЙ БЫСТРЫЙ)

### Шаг 1: Установите Vercel CLI на вашем компьютере

```bash
npm install -g vercel
```

### Шаг 2: Скачайте ТОЛЬКО эти файлы из Figma Make

Создайте папку `easyme-quiz` на компьютере и скопируйте туда:

**Корневые файлы:**
- `package.json`
- `pnpm-lock.yaml`
- `vite.config.ts`
- `postcss.config.mjs`
- `index.html`
- `vercel.json`

**Папка src/:**
- Скопируйте ВСЮ папку `src`

**Файл .gitignore**

### Шаг 3: Установите зависимости

```bash
cd easyme-quiz
pnpm install
```

### Шаг 4: Деплой

```bash
vercel login
vercel --prod
```

Готово! Получите ссылку на ваш сайт.

---

## Способ 2: Через Vercel Dashboard (без CLI)

### Шаг 1: Подготовьте проект

1. Создайте папку `easyme-quiz` на компьютере
2. Скачайте из Figma Make файлы (см. список выше)
3. Поместите их в правильную структуру

### Шаг 2: Загрузите на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Создайте репозиторий на GitHub и загрузите:

```bash
git remote add origin https://github.com/USERNAME/easyme-quiz.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Import вашего репозитория
4. Deploy!

---

## Способ 3: Скачать через браузер

Если архив не нашли, вот что делать:

1. В интерфейсе Figma Make справа есть панель Files
2. Найдите файл `easyme-quiz.tar.gz`
3. Кликните правой кнопкой → Download
4. Распакуйте на компьютере

Если не видите файл - создам новый архив в другом формате!

---

## 📁 Структура проекта (для справки)

```
easyme-quiz/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── postcss.config.mjs
├── vercel.json
├── .gitignore
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── routes.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Quiz.tsx
    │   │   ├── Results.tsx
    │   │   ├── Paywall.tsx
    │   │   └── Loading.tsx
    │   ├── components/
    │   └── utils/
    ├── imports/
    │   ├── alexandra-transformation.png
    │   └── svetlana-transformation.png
    └── styles/
        ├── theme.css
        └── fonts.css
```

## 🆘 Нужна помощь?

Скажите какой способ выбираете - помогу с детальной инструкцией!
