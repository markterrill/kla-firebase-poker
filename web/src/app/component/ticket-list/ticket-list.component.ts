import {Component} from '@angular/core';
import {TicketService} from '../../service/ticket.service';
import {NavService} from "../../service/nav.service";
import {Ticket} from "../../class/ticket";
import {UserProfileService} from "../../service/user-profile.service";
import {LoaderService} from '../../service/loader.service';
import { loadingDelay } from '../../../settings/loading';
import {Observable} from 'rxjs/Observable';
import {User} from '../../class/user';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent {
  tickets: Observable<Ticket[]>;
  user: Observable<User>;

  constructor(public ticketService: TicketService,
              public navService: NavService,
              public userProfileService: UserProfileService,
              private loaderService: LoaderService) {
    this.tickets = ticketService.ticketList$.snapshotChanges().map(action => {
      return action.map(action => {
        const $key = action.payload.key;
        return {$key, ...action.payload.val()};
      });
    });
    this.user = this.userProfileService.currentUser$.valueChanges();

    this.loaderService.showLoader();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, loadingDelay);
  }

  /**
   * Travels to the ticket vote page
   * @param {Ticket} ticket the ticket
   */
  goVote(ticket: Ticket) {
    this.navService.rawNavigate(['/ticket-vote', ticket.$key]);
  }

}
