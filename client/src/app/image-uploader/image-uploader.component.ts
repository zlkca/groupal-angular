
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  @Input() uploadUrl;
  @Input() images;

  @Output() afterDelete = new EventEmitter();
  @Output() afterUpload = new EventEmitter();

  file;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onFileChange(event) {
    const self = this;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        self.postFile(self.uploadUrl, file).subscribe(x => {
          self.afterUpload.emit({
            name: x.result.files.file[0].name,
            // originalFilename: "alashijiaxueyu.jpg"
            // size: 17353
            // type: "image/jpeg"
          });
        });
      };
    }
  }

  // file --- { name:x, size:y, type: z }
  public postFile(url: string, file: any): Observable<any> {
    const formData = new FormData();
    // for (const key in customData) {
    //   if (customData.hasOwnProperty(key)) {
    //     formData.append(key, customData[key]);
    //   }
    // }
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  onUpload() {

  }

  onDelete() {

  }
}
