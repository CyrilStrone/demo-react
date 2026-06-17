/****************************************** Объекты *************************************************/
/**
 * Получить список объектов по ID проекта
 */
export interface getProjectIdObjectListRequest {
  query: PaginationProps & { onlyWithVolumes: boolean }
  path: { id: number }
}

/**
 * Добавить в проект новый объект
 */
export interface postProjectIdObjectAddRequest {
  path: { id: number }
  body: ObjectRequest
}

/**
 * Получить объект по ID
 */
export interface getObjectIdGetRequest {
  path: { id: number }
}

/**
 * Обновить объект по ID
 */
export interface putObjectIdUpdateRequest {
  path: { id: number }
  body: ObjectRequest
}

/**
 * Удалить объект по ID
 */
export interface deleteObjectIdDeleteRequest {
  path: { id: number }
}

/**
 * Добавить в проект или обновить объекты из файла
 */
export interface postProjectIdObjectUploadRequest {
  path: { id: number }
  body: FormData
}

/**
 * Скачать Excel файл
 */
export interface postProjectIdObjectExportExcelFileRequest {
  path: { id: number }
  other: { customName: string }
}

/**
 * Получить прямую ссылку на образец Excel файла
 */
export type getProjectIdObjectLinkExampleRequest = object
