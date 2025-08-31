import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { input } from './ui/input';
import { Clock, User, Settings, BarChart3, AlertTriangle, Beaker } from 'lucide-react';
import { ProductionEntry } from '../types/production';

interface ProductionDataEntryProps {
  productionType: 'knitting' | 'dyeing' | 'finishing';
  onSave: (data: ProductionEntry) => void;
  editingEntry?: ProductionEntry | null;
  onCancel: () => void;
}

export const ProductionDataEntry: React.FC<ProductionDataEntryProps> = ({
  productionType,
  onSave,
  editingEntry,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<ProductionEntry>>({
    date: new Date().toISOString().split('T')[0],
    shift: 'A',
    productionType,
    targetProduction: 0,
    actualProduction: 0,
    efficiency: 0,
    qualityGrade: 'A',
    defectCount: 0,
    machineDowntime: 0,
    notes: ''
  });

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry);
    }
  }, [editingEntry]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate efficiency
      if (field === 'actualProduction' || field === 'targetProduction') {
        const actual = field === 'actualProduction' ? value : updated.actualProduction || 0;
        const target = field === 'targetProduction' ? value : updated.targetProduction || 0;
        updated.efficiency = target > 0 ? Math.round((actual / target) * 100) : 0;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ProductionEntry);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information Section */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <select
                value={formData.shift || 'A'}
                onChange={(e) => handleInputChange('shift', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">Shift A</option>
                <option value="B">Shift B</option>
                <option value="C">Shift C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
              <input
                type="text"
                value={formData.operator || ''}
                onChange={(e) => handleInputChange('operator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Operator name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
              <input
                type="text"
                value={formData.supervisor || ''}
                onChange={(e) => handleInputChange('supervisor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Supervisor name"
                required
              />
            </div>
          </div>
        </div>

        {/* Machine & Timing Section */}
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Machine & Timing</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Machine No</label>
              <input
                type="text"
                value={formData.machineNo || ''}
                onChange={(e) => handleInputChange('machineNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Machine number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime || ''}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={formData.endTime || ''}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
              <input
                type="number"
                value={formData.totalHours || ''}
                onChange={(e) => handleInputChange('totalHours', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.0"
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Production Details Section */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Production Details</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productionType === 'knitting' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                  <input
                    type="text"
                    value={formData.fabricType || ''}
                    onChange={(e) => handleInputChange('fabricType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Fabric type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yarn Type</label>
                  <input
                    type="text"
                    value={formData.yarnType || ''}
                    onChange={(e) => handleInputChange('yarnType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Yarn type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Needle Count</label>
                  <input
                    type="number"
                    value={formData.needleCount || ''}
                    onChange={(e) => handleInputChange('needleCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSM</label>
                  <input
                    type="number"
                    value={formData.gsm || ''}
                    onChange={(e) => handleInputChange('gsm', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>
              </>
            )}
            
            {productionType === 'dyeing' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch No</label>
                  <input
                    type="text"
                    value={formData.batchNo || ''}
                    onChange={(e) => handleInputChange('batchNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Batch number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.color || ''}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Color name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    value={formData.temperature || ''}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                  <input
                    type="number"
                    value={formData.phLevel || ''}
                    onChange={(e) => handleInputChange('phLevel', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    max="14"
                  />
                </div>
              </>
            )}
            
            {productionType === 'finishing' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Process Type</label>
                  <input
                    type="text"
                    value={formData.processType || ''}
                    onChange={(e) => handleInputChange('processType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Process type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speed (m/min)</label>
                  <input
                    type="number"
                    value={formData.speed || ''}
                    onChange={(e) => handleInputChange('speed', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    value={formData.width || ''}
                    onChange={(e) => handleInputChange('width', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tension</label>
                  <input
                    type="number"
                    value={formData.tension || ''}
                    onChange={(e) => handleInputChange('tension', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Production Metrics Section */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Production Metrics</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Production</label>
              <input
                type="number"
                value={formData.targetProduction || ''}
                onChange={(e) => handleInputChange('targetProduction', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.0"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Production</label>
              <input
                type="number"
                value={formData.actualProduction || ''}
                onChange={(e) => handleInputChange('actualProduction', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.0"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency (%)</label>
              <input
                type="number"
                value={formData.efficiency || ''}
                onChange={(e) => handleInputChange('efficiency', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                placeholder="0"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
              <select
                value={formData.qualityGrade || 'A'}
                onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="D">Grade D</option>
              </select>
            </div>
          </div>
        </div>

        {/* Defects & Quality Control Section */}
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Defects & Quality Control</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Defect Count</label>
              <input
                type="number"
                value={formData.defectCount || ''}
                onChange={(e) => handleInputChange('defectCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Defect Type</label>
              <input
                type="text"
                value={formData.defectType || ''}
                onChange={(e) => handleInputChange('defectType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Defect description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Machine Downtime (min)</label>
              <input
                type="number"
                value={formData.machineDowntime || ''}
                onChange={(e) => handleInputChange('machineDowntime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Downtime Reason</label>
              <input
                type="text"
                value={formData.downtimeReason || ''}
                onChange={(e) => handleInputChange('downtimeReason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Reason for downtime"
              />
            </div>
          </div>
        </div>

        {/* Chemical Consumption Section (Dyeing Only) */}
        {productionType === 'dyeing' && (
          <div className="bg-teal-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Beaker className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Chemical Consumption</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dyes (kg)</label>
                <input
                  type="number"
                  value={formData.dyesUsed || ''}
                  onChange={(e) => handleInputChange('dyesUsed', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salt (kg)</label>
                <input
                  type="number"
                  value={formData.saltUsed || ''}
                  onChange={(e) => handleInputChange('saltUsed', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soda (kg)</label>
                <input
                  type="number"
                  value={formData.sodaUsed || ''}
                  onChange={(e) => handleInputChange('sodaUsed', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auxiliaries (kg)</label>
                <input
                  type="number"
                  value={formData.auxiliariesUsed || ''}
                  onChange={(e) => handleInputChange('auxiliariesUsed', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Notes Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Additional Notes</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Production Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Additional notes about production..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {editingEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </div>
  );
};