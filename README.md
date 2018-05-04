## О проекте

Пример аутентификации без фреймворков для аутентификации на Angular и Spring (web Angular)

## Команды из package.json

```
# yarn start // запускает ng serve
# yarn prod // делает сборку проекта в production с base-ref /app
# yarn deploy // деплоит проект в локальную папку ~/Sites/app
```

[Сервер на Spring](https://github.com/lynx-r/angular-spring-authentication-server-spring)

## Angular-ngrx-starter

Demo: https://stackblitz.com/github/Angular-RU/angular-ngrx-starter

## Состав [@ngrx/platform](https://github.com/ngrx/platform) :

* [@ngrx/store](https://github.com/ngrx/platform/tree/master/docs/store/README.md) - менеджер состояний на основе RxJS для Angular приложений, вдохновленный Redux
* [@ngrx/effects](https://github.com/ngrx/platform/tree/master/docs/effects/README.md) - модуль для обработки side effect-ов и передачи их в @ngrx/store через actions
* [@ngrx/router-store](https://github.com/ngrx/platform/tree/master/docs/router-store/README.md) - добавляет Angular Router в @ngrx/store
* [@ngrx/store-devtools](https://github.com/ngrx/platform/tree/master/docs/store-devtools/README.md) - интегрирует приложение с 
  [powerful time-travelling debugger](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
* [@ngrx/entity](https://github.com/ngrx/platform/tree/master/docs/entity/README.md) - модуль для работы с коллекциями записей
* [@ngrx/schematics](https://github.com/ngrx/platform/tree/master/docs/schematics/README.md) - добавляет в Angular-CLI возможность генерации каркаса NgRx компонентов.


# Детали
# Часть 1. Клиент на Angular

## О чем эта статья

В этой статье, я расскажу как написать простую аутентификацию без помощи готовых решений для данной задачи. Она может быть полезна для новичков, которые хотят написать своё AAA (Authentication, Authorization, and Accounting). [Репозиторий клиента на Angular](https://github.com/lynx-r/angular-spring-authentication-web-angular) и [Репозиторий сервера на Spring](https://github.com/lynx-r/angular-spring-authentication-server-spring).

В данной статье я сделаю выдержки кода клиентской части на Angular.

<cut/>

# Клиент использующий сервер аутентифкикации

В этом разделе я опишу некоторые моменты разработки клиента, код которого можно переработать для взаимодействия с вашим сервером через REST API.

Посмотрим на структуру проекта:

    .
    ├── auth                                # Модуль аутентификации
    │   ├── actions
    │   │   └── auth.ts
    │   ├── auth-routing.module.ts
    │   ├── auth.module.ts
    │   ├── components
    │   │   ├── signin.component.ts
    │   │   └── signup.component.ts
    │   ├── containers
    │   │   ├── signin-page.component.ts
    │   │   └── signup-page.component.ts
    │   └── services
    │       └── auth.service.ts
    └── core                                # Главный модуль
        ├── components
        │   └── index.component.ts
        ├── containers
        │   ├── app.component.ts
        │   └── not-found-page.ts
        ├── core-routing.module.ts
        ├── core.module.ts
        ├── models
        │   ├── answer-message.ts
        │   ├── answer.ts                   # Ответ с сервера
        │   ├── notify-type.enum.ts
        │   ├── ping-payload.ts             # Данные для отправки на сервер
        │   └── pong-payload.ts             # Данные для получения ответа с сервера
        ├── reducers
        │   └── reducer.reducer.ts
        └── services
            ├── cookies.service.ts
            ├── ping.service.ts             # Сервисе выполняющий запросы пользователя на сервер
            ├── security.service.ts         # Сервис, в котором реализовано обращение к ААА API сервера
            ├── services.module.ts
            └── utils.service.ts
    
  ## REST клиент для сервис аутентификации/авторизации/регистрации

Для коммуникации с сервером будем использовать обретки для `@angular/common/http/HttpClient` со следующей иерархией:

    api-base
    ├── api-security.service
    └──── security.service 

В них мы имеем вызовы `API` сервера аутнетификации.

Далее, ответы от сервиса `security.service` передаются ниже по иерархии в сервис `auth.service` в нем сохраняется состояние пользователя в `Store` и `Cookies`. `Cookies` используются для восстановления состояния аутнетифицированного пользователя после перезагрузки страницы. И в случае ошибок они обрабатываются путем вывода сообщения в консоль и, затем, передаются вверх по иерархии.

Приведу пример метода аутентификации:

```
authorize(credentials: UserCredentials): Observable<AuthUser | Failure> {
  return this.securityService.authorize(credentials) // Делаем HTTP запрос на сервер
    .pipe(
      tap(authUser => this.setAuthUserState(authUser)), // Сохраняем состояние пользователя
      catchError(error => { // Ловим ошибки
        return this.errorHandler.handleAuthError(error);
      })
    )
}
```

## Полезная нагрузка на сервер

Для отправки запросов на сервер используется обёртка к `HttpClient` - `ping.service`, в которой вызывается метод `ping` `API` сервера на Spring.

## Прерыватель запросов (api-interceptor)

Для отправки данных об аутентифицированном пользователе используются прерыватель HTTP запросов, который кладёт в заголовки AccessToken и UserSession.

Приведу пример кода:

```
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return this.authService.getLoggedUser() // Берём текущего залогиненного пользователя
    .pipe(
      map(authUser => {
        // Добавляем данные в заголовки
        let clonedRequest = req.clone();
        let isLoggedIn = UtilsService.isLoggedIn(authUser);
        if (isLoggedIn) {
          clonedRequest = clonedRequest.clone(
            {
              headers:
                clonedRequest.headers
                  .append(AppConstants.ACCESS_TOKEN_HEADER, authUser.accessToken)
                  .append(AppConstants.USER_SESSION_HEADER, authUser.userSession)
            }
          );
        }
        return next.handle(clonedRequest);
      }),
      switchMap(value => {
        return value;
      }),
    );
}
```

# Схема взаимодействия с сервером

![Диаграмма последовательности взаимодействия с сервером](https://github.com/lynx-r/angular-spring-authentication-web-angular/blob/master/Пример%20двух%20ping%20запросов%20на%20сервер.png)

На диаграмм последовательностей (Sequence Diagram) "Диаграмма последовательности взаимодействия с сервером" изображён процесс выполнения запросов к серверу. После загрузки страницы, клиент отправляет запрос на аутентификацию (здесь рассмотрен случай с пройденной аутентификацией без ошибок). Далее, после получения этого запроса, сервер выдаёт токен. Нужно уточнить, что токен выдаётся не просто так, а после авторизации, которая для упрощения схемы не показана. Подробности по авторизации можно прочитать в смежной статье. Затем, после генерации токена на сервере, возвращается ответ клиенту. Клиент сохраняет этот токен и выполняет `ping` запрос к серверу. Сервер проверяет пришедший токен, обрабатывает данные `ping` запроса и генерирует новый токен. В нашем примере, он просто возвращает строку `"${data.getPing()} from ${authUser.getUsername()} and PONG from server"`. После получения ответа с сервера, клиент сохраняет токен и выполняет с этим новым токеном следующий запрос.

Если токен потеряется или клиент его не правильно сохранит, то этот и следующие запросы не пройдут до тех пор, пока пользователь не авторизуется повторно.

# Заключение

В этой статье мы рассмотрели как сделать простой клиент аутентификации с помощью Angular, который упрощает работу с данной связкой.

# Ссылки

* [Часть 2. Сервер на Spring](https://habr.com/post/354862/)
* [Angular](https://angular.io/)
* [ngrx](https://ngrx.github.io/)
* [angular-ngrx-starter](https://github.com/Angular-RU/angular-ngrx-starter)
