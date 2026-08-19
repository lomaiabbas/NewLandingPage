import http from '../httpService'

class ImageService {
  public async uploadImage(input: any): Promise<any> {
    let result = await http.post('api/app/image/upload-image', input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result.data
  }

  public async uploadVideo(input: any): Promise<any> {
    let result = await http.post('api/app/image/upload-video', input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result.data
  }

  public async uploadFile(input: any): Promise<any> {
    let result = await http.post('api/app/image/upload-file', input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result.data
  }

  public async uploadZipImages(input: any): Promise<any> {
    try {
      let result = await http.post('api/file-upload/upload-zip-images', input, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return result.data
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status
        if (status >= 400 && status < 500) {
          throw new Error('Client error:', status)
        } else if (status >= 500) {
          throw new Error('Server error:', status)
        }
      } else {
        throw new Error('Network error:', err)
      }
    }
  }

  public async uploadWhatsAPPFile(input: any): Promise<any> {
    let result = await http.post('api/app/image/upload-whats-app-file', input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result.data
  }
}

const imageServiceInstance = new ImageService()
export default imageServiceInstance
