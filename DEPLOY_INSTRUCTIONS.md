# 🚀 Инструкция по деплою на Vercel

## Шаг 1: Подготовка проекта

1. **Скачайте архив проекта** (будет создан файл `easyme-quiz.zip`)
2. **Распакуйте** архив на своём компьютере

## Шаг 2: Установка зависимостей

Откройте терминал в папке проекта и выполните:

```bash
# Установите pnpm если его нет
npm install -g pnpm

# Установите зависимости проекта
pnpm install
```

## Шаг 3: Локальная проверка (опционально)

Запустите проект локально чтобы убедиться что всё работает:

```bash
pnpm dev
```

Откройте http://localhost:5173 в браузере.

## Шаг 4: Создание Git репозитория

```bash
# Инициализируйте git
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "Initial commit: EasyME Quiz"
```

## Шаг 5: Загрузка на GitHub

1. Создайте новый репозиторий на **GitHub.com**
2. Не добавляйте README, .gitignore или лицензию (они уже есть)
3. Скопируйте команды из раздела "…or push an existing repository from the command line"

Пример:
```bash
git remote add origin https://github.com/ВАШ_USERNAME/easyme-quiz.git
git branch -M main
git push -u origin main
```

## Шаг 6: Деплой на Vercel

### Вариант A: Через Vercel Dashboard (рекомендуется)

1. Зайдите на **vercel.com** и войдите через GitHub
2. Нажмите **"Add New Project"**
3. Импортируйте ваш GitHub репозиторий `easyme-quiz`
4. Настройки должны определиться автоматически:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
5. Нажмите **"Deploy"**

### Вариант B: Через Vercel CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Залогиньтесь
vercel login

# Деплой проекта
vercel

# Для production деплоя
vercel --prod
```

## Шаг 7: Настройка домена (опционально)

1. В Vercel Dashboard откройте ваш проект
2. Перейдите в **Settings → Domains**
3. Добавьте свой домен и настройте DNS записи

## 🎯 Готово!

Ваш квиз теперь доступен по адресу:
- **Preview URL**: `https://easyme-quiz-xxx.vercel.app`
- **Production URL**: будет показан после деплоя

## 🔧 Обновление проекта

Для обновления проекта просто пушьте изменения в GitHub:

```bash
git add .
git commit -m "Update quiz"
git push
```

Vercel автоматически задеплоит новую версию!

## 📝 Важные файлы

- `vercel.json` - конфигурация для SPA роутинга
- `package.json` - зависимости и скрипты
- `vite.config.ts` - настройки сборки
- `src/app/App.tsx` - главный компонент приложения

## 🆘 Проблемы?

- **404 на роутах**: Проверьте что `vercel.json` загружен
- **Не грузятся изображения**: Убедитесь что все файлы в `src/imports/` загружены
- **Ошибки сборки**: Проверьте логи в Vercel Dashboard → Deployments

---

**Поддержка**: Все вопросы по интеграции с SaleBot смотрите в коде `src/app/utils/urlParams.ts`
