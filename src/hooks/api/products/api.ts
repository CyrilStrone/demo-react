import { AxiosInstance } from 'axios'

import {
  ObjectResponse,
  PaginatedObjectList,
  UploadExcelResult
} from '@local/core/dto'
import { UniversalLinkExample } from '@local/core/types'
import { getDownloadFile } from '@local/functions/get/get-download-media'

import {
  deleteObjectIdDeleteRequest,
  getObjectIdGetRequest,
  getProjectIdObjectListRequest,
  postProjectIdObjectAddRequest,
  postProjectIdObjectExportExcelFileRequest,
  postProjectIdObjectUploadRequest,
  putObjectIdUpdateRequest
} from '.'

export const projectObjectApi = (axiosInstance: AxiosInstance) => ({
  getProjectIdObjectList: (props: getProjectIdObjectListRequest) =>
    axiosInstance.get<PaginatedObjectList>(
      `/project/${props.path.id}/object/list`,
      {
        params: props.query
      }
    ),
  postProjectIdObjectAdd: (props: postProjectIdObjectAddRequest) =>
    axiosInstance.post<ObjectResponse>(
      `/project/${props.path.id}/object/add`,
      props.body
    ),
  postProjectIdObjectUpload: (props: postProjectIdObjectUploadRequest) =>
    axiosInstance.post<UploadExcelResult>(
      `/project/${props.path.id}/object/upload`,
      props.body,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ),
  postProjectIdObjectExportExcelFile: (
    props: postProjectIdObjectExportExcelFileRequest
  ) =>
    axiosInstance
      .post<File>(`/project/${props.path.id}/object/export-excel-file`, null, {
        responseType: 'arraybuffer',
        withCredentials: true
      })
      .then(response => getDownloadFile(response, props.other.customName)),
  getProjectIdObjectLinkExample: (props: UniversalLinkExample) =>
    axiosInstance
      .get<File>(`/object/example`, {
        responseType: 'arraybuffer',
        withCredentials: true
      })
      .then(response => getDownloadFile(response, props.other.customName)),
  getObjectIdGet: (props: getObjectIdGetRequest) =>
    axiosInstance.get<ObjectResponse>(`/object/${props.path.id}/get`),
  putObjectIdGet: (props: putObjectIdUpdateRequest) =>
    axiosInstance.put<ObjectResponse>(
      `/object/${props.path.id}/update`,
      props.body
    ),
  deleteObjectIdGet: (props: deleteObjectIdDeleteRequest) =>
    axiosInstance.delete<ObjectResponse>(`/object/${props.path.id}/delete`)
})
