// import { TestBed, async } from '@angular/core/testing';
// import { AppComponent } from './app.component';
// import {Authenticated} from '../../auth/actions/auth';
//
// describe('AppComponent', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AppComponent
//       ],
//       providers:[{provide:,useClass:MyFakeService}] // --> new code
//     });
//     TestBed.compileComponents();
//   });
//
//   it('should create the app', async(() => {
//     let fixture = TestBed.createComponent(AppComponent);
//     let app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   }));
//
//   it(`should have as title 'app works!'`, async(() => {
//     let fixture = TestBed.createComponent(AppComponent);
//     let app = fixture.debugElement.componentInstance;
//     expect(app.title).toEqual('app works!');
//   }));
//
//   it('should render title in a h1 tag', async(() => {
//     let fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     let compiled = fixture.debugElement.nativeElement;
//     expect(compiled.querySelector('h1').textContent).toContain('app works!');
//   }));
//
//   it('should attach message from service to component', async(() => {
//     let fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     expect(fixture.componentInstance.message).toBe('fake service');
//   }));
//
// });
