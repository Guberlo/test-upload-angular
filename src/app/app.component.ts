import { Component, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "./services/http.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent{
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];
  currentIndex: number = 0;

  constructor (private httpService: HttpService) {}

  /**
   * on file drop handler
   */
  onFileDropped(event: FileList) {
    console.log(event);
    this.prepareFilesList(event);
    
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: FileList) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.currentIndex--;
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.httpService.postFile(this.files[index]).subscribe();
            this.currentIndex = index + 1;
            this.uploadFilesSimulator(this.currentIndex);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: FileList | null) {
    if (files == null) return;
    Array.from(files).forEach(item => {
      (item as any).progress = 0;
      this.files.push(item);
    });

    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(this.currentIndex);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

}