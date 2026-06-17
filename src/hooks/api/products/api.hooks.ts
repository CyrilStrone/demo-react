import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useMutation
} from '@tanstack/react-query'


import {
  deleteObjectIdDeleteRequest,
  getObjectIdGetRequest,
  getProjectIdObjectListRequest,
  postProjectIdObjectAddRequest,
  postProjectIdObjectExportExcelFileRequest,
  postProjectIdObjectUploadRequest,
  projectObjectApi,
  putObjectIdUpdateRequest
} from '.'
import { useAxios } from '@local/contexts/context-axios/context'

export const useObjectList = (props: getProjectIdObjectListRequest) => {
  const { axiosInstance } = useAxios(['axiosInstance'])

  return infiniteQueryOptions({
    queryKey: [queryKeys.projectObject.list, props.query, props.path.id],
    initialPageParam: props.query.offset,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam }) =>
      projectObjectApi(axiosInstance)
        .getProjectIdObjectList({
          query: {
            limit: props.query.limit,
            offset: pageParam,
            query: props.query.query,
            onlyWithVolumes: props.query.onlyWithVolumes
          },
          path: { id: props.path.id }
        })
        .then(res => res.data),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length === props.query.limit
        ? allPages.length * props.query.limit
        : undefined
  })
}

export const useObjectAdd = (
  options?: ICustomMutationFn<
    ObjectResponse,
    postProjectIdObjectAddRequest
  >
) => {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationFn: payload =>
      projectObjectApi(axiosInstance)
        .postProjectIdObjectAdd(payload)
        .then(res => res.data),
    ...options,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.projectObject.list]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.object]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.full]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.kit]
      })
    }
  })
}

export const useObjectId = (props: getObjectIdGetRequest) => {
  const { axiosInstance } = useAxios()

  return queryOptions({
    queryKey: [queryKeys.projectObject.id, props.path.id],
    queryFn: () =>
      projectObjectApi(axiosInstance)
        .getObjectIdGet(props)
        .then(res => res.data)
  })
}

export const useObjectIdFetch = () => {
  const { axiosInstance } = useAxios()

  return async (props: getObjectIdGetRequest) => {
    return queryClient.fetchQuery({
      queryKey: [queryKeys.projectObject.id, props.path.id],
      queryFn: async () =>
        projectObjectApi(axiosInstance)
          .getObjectIdGet(props)
          .then(res => res.data)
    })
  }
}

export const useObjectUpdate = (
  options?: ICustomMutationFn<ObjectResponse, putObjectIdUpdateRequest>
) => {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationFn: payload =>
      projectObjectApi(axiosInstance)
        .putObjectIdGet(payload)
        .then(res => res.data),
    ...options,
    onSettled: data => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.projectObject.id, data?.data?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.projectObject.list]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.full]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.kit]
      })
    }
  })
}

export const useObjectDelete = (
  options?: ICustomMutationFn<
    ObjectResponse,
    deleteObjectIdDeleteRequest
  >
) => {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationFn: payload =>
      projectObjectApi(axiosInstance)
        .deleteObjectIdGet(payload)
        .then(res => res.data),
    ...options,
    onSettled: data => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.projectObject.list]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.projectObject.id, data?.data?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.object]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.full]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.kit]
      })
    }
  })
}

export const useObjectImport = (
  options?: ICustomMutationFn<
    UploadExcelResult,
    postProjectIdObjectUploadRequest
  >
) => {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationFn: payload =>
      projectObjectApi(axiosInstance)
        .postProjectIdObjectUpload(payload)
        .then(res => res.data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.projectObject.list]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.object]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.full]
      })
      queryClient.invalidateQueries({
        queryKey: [queryKeys.sidebarProject.kit]
      })
    },
    ...options
  })
}

export const useObjectExport = (
  options?: ICustomMutationFn<
    void,
    postProjectIdObjectExportExcelFileRequest
  >
) => {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationFn: payload =>
      projectObjectApi(axiosInstance).postProjectIdObjectExportExcelFile(
        payload
      ),
    ...options
  })
}

export const useObjectExample = (
  options?: ICustomMutationFn<void, UniversalLinkExample>
) => {
  const { axiosInstance } = useAxios()
  return useMutation({
    mutationFn: payload =>
      projectObjectApi(axiosInstance).getProjectIdObjectLinkExample(payload),
    ...options
  })
}
