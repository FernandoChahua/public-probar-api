import * as fs from 'fs';
import { CustomLoggerService } from '../logger/custom-logger.service';

export class FileUtil {
  static readonly FILE_PATH_CONFIG_AR = `${process.cwd()}/public/config-ar`;
  static readonly FILE_PATH_BRANDS = `${process.cwd()}/public/brands`;
  static readonly FILE_PATH_PRODUCT_VARIANT = `${process.cwd}/public/product-variants`;

  static readonly logger = new CustomLoggerService(FileUtil.name);

  static async deleteFile(path: string): Promise<void> {
    console.log(path);
    await fs.unlink(`${path}`, (err) => {
      if (err) {
        FileUtil.logger.error(err);
      }
    });
  }

  static getConfigARFile(filename: string) {
    const configARLinkApi = `${process.env.BASE_URL}/file/config-ar`;
    if (!filename) return '';
    const [name, extension] = filename.split('.');
    const basePath = configARLinkApi;
    const filePath = `${basePath}?filename=${name}&extension=${extension}`;

    return filePath;
  }

  static getBrandsFile(filename: string) {
    const brandsLinkApi = `${process.env.BASE_URL}/file/brands`;
    if (!filename) return '';
    const [name, extension] = filename.split('.');
    const basePath = brandsLinkApi;
    const filePath = `${basePath}?filename=${name}&extension=${extension}`;

    return filePath;
  }

  static getProductVariantsFile(filename: string) {
    const productVariantsLinkApi = `${process.env.BASE_URL}/file/product-variants`;
    if (!filename) return '';
    const [name, extension] = filename.split('.');
    const basePath = productVariantsLinkApi;
    const filePath = `${basePath}?filename=${name}&extension=${extension}`;

    return filePath;
  }
}
