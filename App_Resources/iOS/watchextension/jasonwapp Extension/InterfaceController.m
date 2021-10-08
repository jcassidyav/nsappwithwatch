//
//  InterfaceController.m
//  jasonwapp Extension
//
//  Created by archbuild on 04/10/2021.
//

#import "InterfaceController.h"


@interface InterfaceController ()
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *theLabel;
@property (strong, nonatomic) WCSession *session;
@end


@implementation InterfaceController

- (void)awakeWithContext:(id)context {
    [super awakeWithContext:context];

        // Configure interface objects here.
    NSLog(@"Something To Print");
        if ([WCSession isSupported]){
            NSLog(@"Something To Print has session 2");
            self.session = [WCSession defaultSession];
            self.session.delegate = self;
            [self.session activateSession];
        }
}

- (void)willActivate {
    // This method is called when watch view controller is about to be visible to user
}

- (void)didDeactivate {
    // This method is called when watch view controller is no longer visible
}
#pragma mark - WCSession Delegates

//Retrieves and stores access token from the iOS app authentication process.
//Populates UI with a recent selection of calendar events.
- (void)session: (nonnull WCSession *)session didReceiveMessage:(nonnull NSDictionary<NSString *,id> *)message replyHandler:(nonnull void (^)(NSDictionary<NSString *,id> * _Nonnull))replyHandler{
    NSLog(@"This is not what the plugin uses so will never be called.");
    
}

- (void)session: (nonnull WCSession *)session activationDidCompleteWithState:(WCSessionActivationState)activationState error:(nullable NSError *)error{
}

- (void)sessionDidDeactivate:(WCSession *)session {
}

- (void)sessionDidBecomeInactive:(WCSession *)session {
}

- (void)session:(WCSession *)session didReceiveApplicationContext:(NSDictionary<NSString *, id> *)applicationContext{
    NSLog(@"GOT SESSION");
    NSNumber *user = [[applicationContext objectForKey:@"numberObjectKey"] objectForKey:@"convertedInt"] ;
    NSLog(@"%ld", (long)[user integerValue]);
  //  NSLog(applicationContext objectForKey:@"numberObjectKey"]);
    self.theLabel.text = [NSString stringWithFormat: @"%ld", (long)[user integerValue]];
}
@end



