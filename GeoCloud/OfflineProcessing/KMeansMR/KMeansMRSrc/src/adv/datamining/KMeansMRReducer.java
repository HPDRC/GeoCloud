package adv.datamining;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.*;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import adv.datamining.Point;

public class KMeansMRReducer extends Reducer<Text, Text, Text, Text> {

	private ArrayList<Point> newCenters = new ArrayList<Point>();

	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {

		int count = 0;

		ArrayList<Double> tmpP = new ArrayList<Double>();

		for (Text v : values) {

			// output from mapper not modified
			context.write(key, v);

			Point cur = new Point(v.toString(), true);

			if (count == 0) {
				tmpP = cur.coordinates;
				count++;
				continue;
			}

			/* 
			 * Calculate average center
			 * 
			 * Suppose there are n numbers whose average value is x, then for 
			 * a new coming y, the average of all these (n+1) numbers is:
			 * 
			 * (n*x + y) / (1 + n) ==> (x + y/n) / (1 + 1/n)
			 */
			for (int i = 0; i < tmpP.size(); ++i) {
				tmpP.set(i,
						(tmpP.get(i) + cur.coordinates.get(i) * 1.0 / count)
								* 1.0 / (1 + 1.0 / count));
			}
			count++;
		}

		newCenters.add(new Point(-1, tmpP));
	}

	protected void cleanup(Context context) throws IOException,
			InterruptedException {

		Configuration conf = context.getConfiguration();
		int taskId = context.getTaskAttemptID().getTaskID().getId();

		FileSystem fs = FileSystem.get(conf);
		Path nextCenterFile = new Path(conf.get("nextCenter")
				+ File.separator + "iteration_" + (Integer.parseInt(conf.get("iteration")) + 1)
				+ File.separator + "centers_" + taskId);

		BufferedWriter br = new BufferedWriter(new OutputStreamWriter(
				fs.create(nextCenterFile, true)));

		for (Point p : newCenters) {
			br.write("-1," + StringUtils.join(p.coordinates, ",") + "\n");
		}

		br.close();

	}
}
