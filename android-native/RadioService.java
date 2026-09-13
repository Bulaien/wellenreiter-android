package de.bulaien.wellenreiter;
import android.app.*;
import android.content.Intent;
import android.media.*;
import android.os.*;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
public class RadioService extends Service {
  public static final String ACTION_PLAY="de.bulaien.wellenreiter.PLAY",ACTION_PAUSE="de.bulaien.wellenreiter.PAUSE";
  private static final String CHANNEL="wellenreiter_playback";private static final int NOTE_ID=71;private MediaPlayer player;
  @Override public void onCreate(){super.onCreate();getSystemService(NotificationManager.class).createNotificationChannel(new NotificationChannel(CHANNEL,"Radiowiedergabe",NotificationManager.IMPORTANCE_LOW));}
  @Override public int onStartCommand(Intent intent,int flags,int startId){if(intent==null)return START_STICKY;if(ACTION_PAUSE.equals(intent.getAction())){stopPlayback();return START_NOT_STICKY;}if(ACTION_PLAY.equals(intent.getAction())){startForeground(NOTE_ID,note(intent.getStringExtra("title")));startStream(intent.getStringExtra("url"));}return START_STICKY;}
  private void startStream(String url){stopPlayer();try{player=new MediaPlayer();player.setAudioAttributes(new AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).setUsage(AudioAttributes.USAGE_MEDIA).build());player.setWakeMode(getApplicationContext(),PowerManager.PARTIAL_WAKE_LOCK);player.setDataSource(url);player.setOnPreparedListener(MediaPlayer::start);player.setOnErrorListener((mp,w,e)->{stopPlayback();return true;});player.prepareAsync();}catch(Exception e){stopPlayback();}}
  private Notification note(String title){Intent p=new Intent(this,RadioService.class).setAction(ACTION_PAUSE);PendingIntent pi=PendingIntent.getService(this,2,p,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);PendingIntent open=PendingIntent.getActivity(this,1,new Intent(this,MainActivity.class),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);return new NotificationCompat.Builder(this,CHANNEL).setSmallIcon(android.R.drawable.ic_media_play).setContentTitle(title).setContentText("Wellenreiter · Live Radio").setContentIntent(open).setOngoing(true).addAction(android.R.drawable.ic_media_pause,"Pause",pi).build();}
  private void stopPlayer(){if(player!=null){try{player.stop();}catch(Exception ignored){}player.release();player=null;}}
  private void stopPlayback(){stopPlayer();stopForeground(STOP_FOREGROUND_REMOVE);stopSelf();}
  @Override public void onDestroy(){stopPlayer();super.onDestroy();}
  @Nullable @Override public IBinder onBind(Intent i){return null;}
}
