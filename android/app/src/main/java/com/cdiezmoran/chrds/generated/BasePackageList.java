package com.cdiezmoran.chrds.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.ads.admob.AdMobPackage(),
        new expo.modules.av.AVPackage(),
        new expo.modules.brightness.BrightnessPackage(),
        new expo.modules.camera.CameraPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.facebook.FacebookPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.imagepicker.ImagePickerPackage(),
        new expo.modules.inapppurchases.InAppPurchasesPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.location.LocationPackage(),
        new expo.modules.medialibrary.MediaLibraryPackage(),
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.sqlite.SQLitePackage(),
        new expo.modules.videothumbnails.VideoThumbnailsPackage(),
        new expo.modules.webbrowser.WebBrowserPackage()
    );
  }
}
