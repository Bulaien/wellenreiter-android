package de.bulaien.wellenreiter;
import android.content.Intent;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
@CapacitorPlugin(name = "Radio")
public class RadioPlugin extends Plugin {
  @PluginMethod public void play(PluginCall call) {
    String url=call.getString("url"), title=call.getString("title","Wellenreiter");
    if(url==null){call.reject("Stream-Adresse fehlt");return;}
    Intent i=new Intent(getContext(),RadioService.class).setAction(RadioService.ACTION_PLAY).putExtra("url",url).putExtra("title",title);
    ContextCompat.startForegroundService(getContext(),i);call.resolve(new JSObject());
  }
  @PluginMethod public void pause(PluginCall call) {
    getContext().startService(new Intent(getContext(),RadioService.class).setAction(RadioService.ACTION_PAUSE));call.resolve(new JSObject());
  }
}
