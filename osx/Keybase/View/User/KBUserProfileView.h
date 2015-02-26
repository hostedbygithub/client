//
//  KBUserProfileView.h
//  Keybase
//
//  Created by Gabriel on 1/12/15.
//  Copyright (c) 2015 Gabriel Handford. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "KBAppKit.h"
#import "KBRPC.h"
#import "KBTrackView.h"

@interface KBUserProfileView : YONSView

@property KBNavigationView *navigation;
@property (getter=isPopup) BOOL popup;

- (void)setUser:(KBRUser *)user editable:(BOOL)editable client:(id<KBRPClient>)client;

- (void)clear;

@end
