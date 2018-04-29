
export class AppConstants {
  static ALPH: { [key: number]: string } = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
    9: 'i',
    10: 'j',
  };

  static MY_DATE_FORMATS = {
    parse: {
      dateInput: 'yyyy.MM.dd',
    },
    display: {
      dateInput: 'input',
      monthYearLabel: { year: 'numeric', month: 'short' },
      dateA11yLabel: { year: 'numeric', month: 'short', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'short' },
    },
  };

  static API_KEYS_URL: string = 'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/api-keys/api-keys.json';

  static REGISTER_RESOURCE: string = '/register';
  static AUTHORIZE_RESOURCE: string = '/authorize';
  static AUTHENTICATE_RESOURCE: string = '/authenticate';
  static LOGOUT_RESOURCE: string = '/logout';

  static ARTICLES_RESOURCE: string = '/articles';
  static REMOVE_ARTICLE_RESOURCE: string = '/article';
  static ARTICLE_RESOURCE: string = '/article';
  static BOARDS_RESOURCE: string = '/boards';
  static BOARD_RESOURCE: string = '/board';
  static UNDO: string = '/undo';
  static REDO: string = '/redo';

  static HOST: string = 'http://localhost:4200';
  static ARTICLE_PAGE_SIZE: number = 50;
  static PLACE_MODE: string = 'place';
  static MOVE_MODE: string = 'move';
  static EDIT_MODE: string = 'edit';
  static ARTICLE_CREATE_COOKIE: string = 'article-create-cookie';
  static DRAUGHT_PLACE_COOKIE: string = 'draught-place-cookie';
  static DELETE_DRAUGHT_CHECKED_COOKIE: string = 'delete-draught-checked-cookie';
  static EDIT_MODE_COOKIE: string = 'edit-mode-cookie';
  static SIGN_REQUEST: string = 'sign-request';
  static SIGN: string = 'sign';
  static DEBOUNCE_SAVE = 2000;
  static SIMPLE_STROKE: string = 'SIMPLE';
  static ARTICLE_INFO_TAB_COOKIE: string = 'article-info-tab';
  static SIMPLE_STROKE_NOTATION: string = '-';
  static CAPTURE_STROKE_NOTATION: string = ':';
  static PAGE_LOADING_MESSAGE: string = 'Загрузка страницы...';
  static LOADING_ARTICLE_MESSAGE: string = 'Загрузка статей...';
  static REMOVE_ARTICLE_MESSAGE: string = 'Удаление статьи...';
  static CREATING_ARTICLE_MESSAGE: string = 'Добавление статьи...';
  static LOGIN_MESSAGE: string = 'Вход на сайт...';
  static REGISTER_MESSAGE: string = 'Регистрация на сайте...';
  static X_API_KEY: string = 'x-api-key';
  static REQUESTED_API: string = 'requested-api';
  static API_ARTICLE: string = 'api-article';
  static API_BOARD: string = 'api-board';
  static HTTP_RETRY: number = 0;
  static LAYOUT_SCROLL_TOP = 'scrollTop';
  static ARTICLE_CONTENT_ELLIPSE_SYMBOLS = 300;
  static ARTICLE_TITLE_ELLIPSE_SYMBOLS = 25;
  static ARTICLE_CONTENT_MIN_SYMBOLS = 300;
  static ARTICLE_TITLE_MIN_SYMBOLS = 4;
  static PATH_ROOT: string = 'landing';
  static USER_SESSION_HEADER: string = 'user-session';
  static AUTH_COUNTER_SESSION_HEADER: string = 'auth-counter';
  static FILTER_EXPRESSION_HEADER: string = 'filter-expression';
  static FILTER_VALUES_HEADER: string = 'filter-values';
  static USER_ROLES_HEADER: string = 'user-roles';
  static ANONYMOUS_ROLE: string = 'ANONYMOUS';
  static ACCESS_TOKEN_HEADER: string = 'access-token';
  static AUTH_USER_PAYLOAD_CLASS: string = 'AuthUser';
  static REGISTER_USER_PAYLOAD_CLASS: string = 'RegisterUser';
  static CREATE_ARTICLE_PAYLOAD_CLASS: string = 'CreateArticlePayload';
  static CREATE_BOARD_PAYLOAD_CLASS: string = 'CreateBoardPayload';
  static ARTICLE_PAYLOAD_CLASS: string = 'Article';
  static ARTICLE_SAVED_MESSAGE: string = 'Статья сохранена';
  static ARTICLE_PUBLISHED_MESSAGE: string = 'Статья опубликована';
  static BOARD_META_SAVED_MESSAGE: string = 'Мета информация сохранена';

  static CREATE_ARTICE_NEW_ARTICLE_TITLE = 'Новая статья про шашки от ';
  static AUTH_USER_COOKIE: string = 'auth-user';
  static ANONYMOUS_SESSION_COOKIE: string = 'anonymous-session';
}
