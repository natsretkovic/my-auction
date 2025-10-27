import { Injectable,inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuctionService } from '../../services/auction.service';
import * as AuctionActions from './auction.actions';
import { catchError, map, mergeMap, of, switchMap, forkJoin } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SocketService } from '../../services/socket.service';
import { Auction } from '../../models/auction.model';
import { MyBidDto } from '../../models/dtos/my.bid.dto';

@Injectable()
export class AuctionEffects {
  private actions$: Actions = inject(Actions);
  private auctionService: AuctionService = inject(AuctionService);
  private socketService: SocketService = inject(SocketService);
  constructor(/*private actions$: Actions, private auctionService: AuctionService,private router: Router*/) {}

  addAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.addAuction),
      mergeMap(action =>
        this.auctionService.addAuction(action.auction).pipe(
          map(response => AuctionActions.addAuctionSuccess({ auction: response.auction })),
          catchError(err => of(AuctionActions.addAuctionFailure({ error: err.message })))
        )
      )
    )
  );
   loadAuctionById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadAuctionById),
      mergeMap(({ id }) =>
        this.auctionService.getAuctionById(id).pipe(
          map(auction => AuctionActions.loadAuctionByIdSuccess({ auction })),
          catchError(error =>
            of(AuctionActions.loadAuctionByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  placeBid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.placeBid),
      mergeMap(({ auctionId, bidAmount }) =>
        this.auctionService.placeBid(auctionId, bidAmount).pipe(
          map(() => AuctionActions.placeBidSuccess()), 
          catchError(error =>
            of(AuctionActions.placeBidFailure({ error: error.message }))
          )
        )
      )
    )
  );
  listenForNewBids$ = createEffect(() =>
        this.socketService.listen<{ auctionId: string, newAuction: Auction }>('newBid').pipe(
            map(data => AuctionActions.bidReceivedFromSocket({ auction: data.newAuction }))
        )
    );
  joinAuctionRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuctionActions.joinAuctionRoom),
            tap(({ auctionId }) => { 
                this.socketService.joinRoom(auctionId);
            })
        ),
        { dispatch: false }
    );

  updateAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.updateAuction),
      switchMap(action =>
        this.auctionService.updateAuction(action.auctionId, action.data).pipe(
          map(auction => {
             alert('Aukcija uspešno ažurirana!');
             return AuctionActions.updateAuctionSuccess({ auction });
          }),
          catchError(error => of(AuctionActions.updateAuctionFailure({ error })))
        )
      )
    )
  );

  deleteAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.deleteAuction),
      switchMap(action =>
        this.auctionService.deleteAuction(action.auctionId).pipe(
          map(() => AuctionActions.deleteAuctionSuccess({ auctionId: action.auctionId })), 
          catchError(error => of(AuctionActions.deleteAuctionFailure({ error })))
        )
      )
    )
  );
  expireAuction$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuctionActions.expireAuction),
    switchMap(({ auctionId }) =>
      this.auctionService.expireAuction(auctionId).pipe(
        map(() => AuctionActions.expireAuctionSuccess({ auctionId })),
        catchError(error => of(AuctionActions.expireAuctionFailure({ error })))
        )
      )
    )
  );
  loadUserBids$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadUserBids),
      mergeMap(() =>
        this.auctionService.getMyBids().pipe(
          map((bids: MyBidDto[]) => AuctionActions.loadUserBidsSuccess({ userBids: bids })),
          catchError((error) => of(AuctionActions.loadUserBidsFailure({ error })))
        )
      )
    )
  );
  loadInitialAuctions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.loadInitialAuctions),
      switchMap(() =>
        forkJoin({
          popular: this.auctionService.getPopularAuctions(),
          recent: this.auctionService.getRecentAuctions(),
          endingSoon: this.auctionService.getEndingSoonAuctions(),
        }).pipe(
          map(result => 
            AuctionActions.loadInitialAuctionsSuccess({ 
                popular: result.popular,
                recent: result.recent,
                endingSoon: result.endingSoon,
            })
          ),
          catchError(error => 
            of(AuctionActions.loadInitialAuctionsFailure({ error: error.message || 'Greška pri inicijalnom učitavanju' }))
          )
        )
      )
    )
  );
  searchAuctions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuctionActions.searchAuctions),
      switchMap(action =>
        this.auctionService.searchAuctions(action.keyword).pipe(
          map(auctions => AuctionActions.searchAuctionsSuccess({ auctions })),
          catchError(error => 
            of(AuctionActions.searchAuctionsFailure({ error: error.message || 'Greška pri pretrazi' }))
          )
        )
      )
    )
  );
  loadUserAuctions$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuctionActions.loadUserAuctions),
      
      switchMap(() => 
        this.auctionService.getMyAuctions().pipe(
          
          map(auctions => 
            AuctionActions.loadUserAuctionsSuccess({ auctions })
          ),
          
          catchError(error => 
            of(AuctionActions.loadUserAuctionsFailure({ error: error.message || 'Greška pri učitavanju aukcija korisnika.' }))
          )
        )
      )
    )
  );
  reloadUserAuctionsOnAddSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuctionActions.addAuctionSuccess, AuctionActions.deleteAuctionSuccess),
      map(() => AuctionActions.loadUserAuctions()) 
    )
  );
}
